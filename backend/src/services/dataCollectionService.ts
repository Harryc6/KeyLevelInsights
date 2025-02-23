import { getConnectedRealmIDs } from './connectedRealmService'
import { getCurrentPeriod } from './mythicKeystoneService'
import { getMythicLeaderboardByDungeonAndPeriod } from './mythicLeaderboadService'
import { insertCharacters, insertRuns } from './insertService'
import { dpsIDs, dungeonIDs, dungeonMap, healerIDs, tankIDs } from '../types/kli/map'
import { LeadingGroup, Member } from '../types/bnet/mythicLeaderboard'
import { Run } from '../types/kli/run'

export const updateAllExpansionsRuns = async () => {
    // run from the start of the season (period 977) to the current period
    const currentPeriod = await getCurrentPeriod()
    const periods = Array.from({ length: currentPeriod - 977 }, (_, i) => currentPeriod - i)
    for (const period of periods) {
        await collectAndStoreRuns(period)
    }
}

export const collectAndStoreRuns = async (period?: number) => {
    const [connectedRealmIDs, currentPeriod] = await Promise.all([getConnectedRealmIDs(), getCurrentPeriod()])
    console.time(`Collection & storage of all dungeon runs for period ${period ?? currentPeriod}`)
    for (const dungeonID of dungeonIDs) {
        await collectAndStoreRunsByDungeon(dungeonID, connectedRealmIDs, period ?? currentPeriod)
    }
    console.timeEnd(`Collection & storage of all dungeon runs for period ${period ?? currentPeriod}`)
    console.log('****************************************************************')
    return Promise.resolve()
}

async function collectAndStoreRunsByDungeon(dungeon: number, connectedRealmIDs: number[], period: number) {
    console.log(`Collecting leaderboards for ${dungeonMap.get(dungeon)} for period ${period}`)
    console.time(`Collection & storage of ${dungeonMap.get(dungeon)} runs for period ${period}`)
    const leaderboards: LeadingGroup[] = await fetchLeaderboards(connectedRealmIDs, dungeon, period)
    const uniqueRuns = getUniqueRuns(leaderboards)
    const uniqueCharacters = getUniqueCharacters(uniqueRuns)
    await saveLeaderboardData(uniqueRuns, dungeon, period, uniqueCharacters)
    console.timeEnd(`Collection & storage of ${dungeonMap.get(dungeon)} runs for period ${period}`)
    console.log('****************************************************************')
    return Promise.resolve()
}

const fetchLeaderboards = async (connectedRealmIDs: number[], dungeonID: number, currentPeriod: number) => {
    console.time(`Fetched leaderboards in`)
    let completed = 0
    process.stdout.write(
        `Fetching leaderboards for ${dungeonMap.get(dungeonID)}: ${completed}/${connectedRealmIDs.length}`
    )
    const results = await Promise.all(
        connectedRealmIDs.map(async (id) => {
            const results = await getMythicLeaderboardByDungeonAndPeriod(id, dungeonID, currentPeriod)
            if (completed + 1 === connectedRealmIDs.length) process.stdout.write('\r\x1b[K')
            else process.stdout.write(`\rFetching leaderboards: ${++completed} / ${connectedRealmIDs.length}`)
            return results
        })
    ).then((results) => results.flatMap((board) => board.leading_groups))
    console.log(`Fetched leaderboards containing ${results.length} runs`)
    console.timeEnd(`Fetched leaderboards in`)
    return results
}

const getUniqueRuns = (runs: LeadingGroup[]) => {
    const uniqueRuns = new Map<string, LeadingGroup>()
    console.time('Filtered Unique runs')
    runs.forEach((run) => {
        if (!run) return

        const key = `${run.mythic_rating.rating}-${run.duration}-${run.keystone_level}-${run.completed_timestamp}-${run.members.map((m) => m.profile.name).join(',')}`
        if (!uniqueRuns.has(key) && run.members.every((member) => member.specialization?.id !== undefined)) {
            uniqueRuns.set(key, run)
        }
    })
    console.timeEnd('Filtered Unique runs')
    return Array.from(uniqueRuns.values())
}

const getUniqueCharacters = (uniqueRuns: LeadingGroup[]) => {
    const uniqueCharactersMap = new Map<number, Member>()
    console.time('Filtered Unique characters')
    uniqueRuns.forEach((run) => {
        run.members.forEach((member) => {
            if (!uniqueCharactersMap.has(member.profile.id)) {
                uniqueCharactersMap.set(member.profile.id, member)
            }
        })
    })
    console.timeEnd('Filtered Unique characters')
    return Array.from(uniqueCharactersMap.values())
}

async function saveLeaderboardData(
    uniqueRuns: LeadingGroup[],
    dungeon: number,
    period: number,
    uniqueCharacters: Member[]
) {
    console.time(`Inserting data`)
    await prepareRunsInsert(uniqueRuns, dungeon, period)
    await prepCharacterInsert(uniqueCharacters)
    console.timeEnd(`Inserting data`)
    return Promise.resolve()
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
