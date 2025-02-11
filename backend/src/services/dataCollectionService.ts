import { getConnectedRealmIDs } from './connectedRealmService'
import { getCurrentPeriod } from './mythicKeystoneService'
import { getMythicLeaderboardByDungeonAndPeriod } from './mythicLeaderboadService'
import { insertCharacters, insertRuns } from './insertService'
import Bottleneck from 'bottleneck'
import { dpsIDs, dungeonIDs, dungeonMap, healerIDs, tankIDs } from '../types/kli/map'
import { LeadingGroup, Member, MythicLeaderboardDetails } from '../types/bnet/mythicLeaderboard'
import { Run } from '../types/kli/run'

const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 1000 / 300 })
const getMythicLeaderboardByDungeonAndPeriodLimited = limiter.wrap(getMythicLeaderboardByDungeonAndPeriod)

export const collectAndStoreRuns = async () => {
    const [connectedRealmIDs, currentPeriod] = await Promise.all([getConnectedRealmIDs(), getCurrentPeriod()])
    await Promise.all(
        dungeonIDs.map((dungeonID) => collectAndStoreRunsByDungeon(dungeonID, connectedRealmIDs, currentPeriod))
    )
}

async function collectAndStoreRunsByDungeon(dungeon: number, connectedRealmIDs: number[], period: number) {
    console.log(`Collecting leaderboards for ${dungeonMap.get(dungeon)} (${dungeon})...`)
    const leaderboards: MythicLeaderboardDetails[] = await fetchLeaderboards(connectedRealmIDs, dungeon, period)

    const uniqueRuns = getUniqueRuns(leaderboards)
    const uniqueCharacters = getUniqueCharacters(uniqueRuns)

    logCollectionResults(dungeon, period, connectedRealmIDs, leaderboards, uniqueRuns, uniqueCharacters)

    await prepareRunsInsert(uniqueRuns, dungeon, period)
    await prepCharacterInsert(uniqueCharacters)
}

const fetchLeaderboards = async (connectedRealmIDs: number[], dungeonID: number, currentPeriod: number) => {
    return await Promise.all(
        connectedRealmIDs.map((id) => getMythicLeaderboardByDungeonAndPeriodLimited(id, dungeonID, currentPeriod))
    )
}

const getUniqueRuns = (leaderboards: MythicLeaderboardDetails[]) => {
    return leaderboards
        .flatMap((board) => board.leading_groups)
        .filter(Boolean)
        .sort((a, b) => b.keystone_level - a.keystone_level || b.mythic_rating.rating - a.mythic_rating.rating)
        .filter(
            (run, index, self) =>
                // find the first run with the same rating, duration, keystone level, completed timestamp and members
                self.findIndex(
                    (r) =>
                        r.mythic_rating.rating === run.mythic_rating.rating &&
                        r.duration === run.duration &&
                        r.keystone_level === run.keystone_level &&
                        r.completed_timestamp === run.completed_timestamp &&
                        r.members.every((m, i) => m.profile.name === run.members[i].profile.name)
                ) === index
        )
        .filter((run) =>
            // filter out runs with missing specialization ids
            run.members.every(
                (member) => !(member.specialization === undefined || member.specialization.id === undefined)
            )
        )
}

const getUniqueCharacters = (uniqueRuns: LeadingGroup[]) => {
    return uniqueRuns
        .flatMap((run) => run.members)

        .filter((character, index, self) => self.findIndex((c) => c.profile.id === character.profile.id) === index)
}

const logCollectionResults = (
    dungeonID: number,
    currentPeriod: number,
    connectedRealmIDs: number[],
    leaderboards: MythicLeaderboardDetails[],
    uniqueRuns: LeadingGroup[],
    uniqueCharacters: Member[]
) => {
    console.info(`****************************************************************`)
    console.info(`Leaderboards for ${dungeonMap.get(dungeonID)} (${dungeonID}) for period ${currentPeriod} collected`)
    console.info(`Total connected realms: ${connectedRealmIDs.length}`)
    console.info(`Total runs: ${leaderboards.flatMap((board) => board.leading_groups).length}`)
    console.info(`Unique runs: ${uniqueRuns.length}`)
    console.info(`Unique characters: ${uniqueCharacters.length}`)
    console.info(`****************************************************************`)
}

async function prepCharacterInsert(uniqueCharacters: Member[]) {
    const characters = uniqueCharacters.map((member) => ({
        character_id: member.profile.id,
        name: member.profile.name,
        realm: member.profile.realm.id,
        spec: member.specialization.id,
    }))

    await insertCharacters(characters)
}

async function prepareRunsInsert(uniqueRuns: LeadingGroup[], dungeonID: number, currentPeriod: number) {
    const runs: Run[] = uniqueRuns.map((run) => {
        if (run.members.some((run) => run.specialization.id === undefined))
            console.error(
                `Run with missing specialization id detected: ${JSON.stringify(run.members.find((run) => run.specialization === undefined))}`
            )
        return {
            dungeon: dungeonID,
            keystone_level: run.keystone_level,
            rating: run.mythic_rating.rating,
            duration: run.duration,
            completed_timestamp: run.completed_timestamp,
            period: currentPeriod,
            // find any tank specializations in the run and place their profile id in the tank field
            tank: run.members
                .filter((member) => tankIDs.includes(member.specialization.id))
                .map((member) => member.profile.id),
            // find any healer specializations in the run and place their profile id in the healer field
            healer: run.members
                .filter((member) => healerIDs.includes(member.specialization.id))
                .map((member) => member.profile.id),
            // find any dps specializations in the run and place their profile id in the dps field
            dps: run.members
                .filter((member) => dpsIDs.includes(member.specialization.id))
                .map((member) => member.profile.id),
        }
    })

    await insertRuns(runs)
}
