import { getAllConnectedRealmIDs } from './connectedRealmService'
import { getCurrentPeriod } from './mythicKeystoneService'
import { getMythicLeaderboardByDungeonAndPeriod } from './mythicLeaderboadService'
import { insertCharacters, insertRuns, insertKeystoneFrequency } from './insertService'
import {
    dpsIDs,
    healerIDs,
    tankIDs,
    getDungeonMapByPeriod,
    getDungeonIDsByPeriod,
    specIds,
    SpecId,
    specDBNames,
} from '../types/kli/map'
import { LeadingGroup, Member } from '../types/bnet/mythicLeaderboard'
import { Run } from '../types/kli/run'
import { DBKeystoneFrequency } from '../models/keystoneFrequency'
import { RegionConnectedRealms } from '../models/connectedRealm'

export const updateAllExpansionsRuns = async () => {
    // run from the start of the season (period 977) to the current period
    const currentPeriod = await getCurrentPeriod()
    const periods = Array.from({ length: currentPeriod - 977 }, (_, i) => currentPeriod - i)
    for (const period of periods) {
        await collectAndStoreRuns(period)
    }
}

export const collectAndStoreRuns = async (period?: number) => {
    const [regionConnectedRealms, currentPeriod] = await Promise.all([getAllConnectedRealmIDs(), getCurrentPeriod()])
    console.time(`Collection & storage of all dungeon runs for period ${period ?? currentPeriod}`)
    const dungeonIDsList = getDungeonIDsByPeriod(period ?? currentPeriod)

    for (const dungeonID of dungeonIDsList) {
        await collectAndStoreRunsByDungeon(dungeonID, regionConnectedRealms, period ?? currentPeriod)
    }
    console.timeEnd(`Collection & storage of all dungeon runs for period ${period ?? currentPeriod}`)
    console.log('****************************************************************')
    return Promise.resolve()
}

async function collectAndStoreRunsByDungeon(
    dungeon: number,
    regionConnectedRealms: RegionConnectedRealms[],
    period: number
) {
    const dungeonMap = getDungeonMapByPeriod(period)
    console.log(`Collecting leaderboards for ${dungeonMap.get(dungeon)} for period ${period}`)
    console.time(`Collection & storage of ${dungeonMap.get(dungeon)} runs for period ${period}`)
    const leaderboards: LeadingGroup[] = await fetchLeaderboards(regionConnectedRealms, dungeon, period)
    const uniqueRuns = getUniqueRuns(leaderboards)
    const uniqueCharacters = getUniqueCharacters(uniqueRuns)
    await saveLeaderboardData(uniqueRuns, dungeon, period, uniqueCharacters)
    console.timeEnd(`Collection & storage of ${dungeonMap.get(dungeon)} runs for period ${period}`)
    console.log('****************************************************************')
    return Promise.resolve()
}

const fetchLeaderboards = async (
    regionConnectedRealms: RegionConnectedRealms[],
    dungeonID: number,
    currentPeriod: number
) => {
    console.time(`Fetched leaderboards in`)
    const allResults: LeadingGroup[] = []

    for (const rcr of regionConnectedRealms) {
        let completed = 0
        console.time(`Fetched leaderboards for region ${rcr.region}`)
        process.stdout.write(`Fetched leaderboards for region ${rcr.region}: ${completed} / ${rcr.realms.length}`)
        await Promise.all(
            rcr.realms.map(async (id) => {
                const results = await getMythicLeaderboardByDungeonAndPeriod(id, dungeonID, currentPeriod, rcr.region)
                completed++
                process.stdout.write(
                    `\rFetched leaderboards for region ${rcr.region}: ${completed} / ${rcr.realms.length}`
                )
                return results
            })
        )
            .then((results) => {
                const flatResults = results.flatMap((board) => board.leading_groups)
                console.log(`\r\x1b[KFetched ${flatResults.length} runs for region ${rcr.region}`)
                allResults.push(...flatResults)
            })
            .catch((error) => {
                console.error(`\r\x1b[KError fetching leaderboards for region ${rcr.region}:`, error)
                throw error
            })
            .finally(() => {
                console.timeEnd(`Fetched leaderboards for region ${rcr.region}`)
            })
    }

    console.log(`Fetched leaderboards containing ${allResults.length} runs`)
    console.timeEnd(`Fetched leaderboards in`)
    return allResults
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
    // If development environment, insert all characters and runs
    if (process.env.ENVIROMENT === 'development') {
        await prepareRunsInsert(uniqueRuns, dungeon, period)
        await prepCharacterInsert(uniqueCharacters)
    }
    await prepKeystoneFrequencyInsert(uniqueRuns, dungeon, period)
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
            tank: run.members
                .filter((member) => tankIDs.includes(member.specialization.id))
                .map((member) => ({ character_id: member.profile.id, spec_id: member.specialization.id })),
            // find any healer specializations in the run and place their profile id in the healer field
            healer: run.members
                .filter((member) => healerIDs.includes(member.specialization.id))
                .map((member) => ({ character_id: member.profile.id, spec_id: member.specialization.id })),
            // find any dps specializations in the run and place their profile id in the dps field
            dps: run.members
                .filter((member) => dpsIDs.includes(member.specialization.id))
                .map((member) => ({ character_id: member.profile.id, spec_id: member.specialization.id })),
        }
    })

    await insertRuns(runs)
}

async function prepKeystoneFrequencyInsert(uniqueRuns: LeadingGroup[], dungeon: number, period: number) {
    console.time('Inserting keystone frequency')
    const keystoneFrequencies = new Map<string, DBKeystoneFrequency>()
    uniqueRuns.forEach((run) => {
        const key = `${run.keystone_level}`
        if (!keystoneFrequencies.has(key)) {
            keystoneFrequencies.set(`${run.keystone_level}`, {
                keystone_level: run.keystone_level,
                period: period,
                dungeon: dungeon,
                arcane: 0,
                fire: 0,
                frost_mage: 0,
                holy_paladin: 0,
                protection_paladin: 0,
                retribution: 0,
                arms: 0,
                fury: 0,
                protection_warrior: 0,
                balance: 0,
                feral: 0,
                guardian: 0,
                restoration_druid: 0,
                blood: 0,
                frost_death_knight: 0,
                unholy: 0,
                beast_mastery: 0,
                marksmanship: 0,
                survival: 0,
                discipline: 0,
                holy_priest: 0,
                shadow: 0,
                assassination: 0,
                outlaw: 0,
                subtlety: 0,
                elemental: 0,
                enhancement: 0,
                restoration_shaman: 0,
                affliction: 0,
                demonology: 0,
                destruction: 0,
                brewmaster: 0,
                windwalker: 0,
                mistweaver: 0,
                havoc: 0,
                vengeance: 0,
                devastation: 0,
                preservation: 0,
                augmentation: 0,
                total_runs: 0,
            })
        }
        const kf = keystoneFrequencies.get(`${run.keystone_level}`)
        if (kf) {
            run.members.forEach((member) => {
                kf[specDBNames[specIds.indexOf(member.specialization.id as SpecId)]]++
            })
            kf.total_runs++
        } else {
            console.error(`Failed to get keystone frequency for keystone level ${run.keystone_level}`)
        }
    })

    await insertKeystoneFrequency(Array.from(keystoneFrequencies.values()))
    console.timeEnd('Inserting keystone frequency')
}
