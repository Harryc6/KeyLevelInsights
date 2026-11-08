import { getAllConnectedRealmIDs } from './connectedRealmService'
import { getCurrentPeriod } from './mythicKeystoneService'
import { getMythicLeaderboardByDungeonAndPeriod } from './mythicLeaderboadService'
import { insertCharacters, insertKeystoneFrequency, insertRuns } from './insertService'
import {
    dpsIDs,
    Dungeon,
    DungeonId,
    getDungeonsByPeriod,
    healerIDs,
    specDBNames,
    SpecId,
    specIds,
    tankIDs,
} from '../types/kli/map'
import { LeadingGroup, Member } from '../types/bnet/mythicLeaderboard'
import { Run } from '../types/kli/run'
import { DBKeystoneFrequency } from '../models/keystoneFrequency'
import { RegionConnectedRealms } from '../models/connectedRealm'
import { BNetRequestError, Region } from '../utils/bNetQuery'

type UnavailableLeaderboard = {
    region: Region
    dungeon: number
    period: number
    realmCount: number
    exampleUrl: string
}

class UnavailableLeaderboardError extends Error {
    constructor(readonly details: UnavailableLeaderboard) {
        super(
            `Blizzard returned HTTP 404 for all ${details.realmCount} realms in region ${details.region}, ` +
            `dungeon ${details.dungeon}, period ${details.period}. Example: ${details.exampleUrl}`
        )
        this.name = 'UnavailableLeaderboardError'
    }
}

export const updateAllExpansionsRuns = async () => {
    // run from the start of the season (period 977) to the current period
    const currentPeriod = await getCurrentPeriod()
    const periods = Array.from({ length: currentPeriod - 977 }, (_, i) => currentPeriod - i)
    const unavailable: UnavailableLeaderboard[] = []
    for (const period of periods) {
        unavailable.push(...(await collectAndStoreRuns(period)))
    }
    if (unavailable.length > 0) {
        console.warn(
            `Historical backfill finished with ${unavailable.length} unavailable dungeon-periods. ` +
            'These gaps were not saved as zero runs; see the skipped-history warnings for retry targets.'
        )
    } else {
        console.log('Historical backfill finished without unavailable dungeon-periods')
    }
    return unavailable
}

export const collectAndStoreRuns = async (period?: number) => {
    const [regionConnectedRealms, currentPeriod] = await Promise.all([getAllConnectedRealmIDs(), getCurrentPeriod()])
    const targetPeriod = period ?? currentPeriod
    const unavailable: UnavailableLeaderboard[] = []
    const timer = `Collection & storage of all dungeon runs for period ${targetPeriod}`
    console.time(timer)
    try {
        const dungeonsList: Dungeon[] = getDungeonsByPeriod(targetPeriod)
        for (const dungeon of dungeonsList) {
            try {
                await collectAndStoreRunsByDungeon(dungeon, regionConnectedRealms, targetPeriod)
            } catch (error) {
                if (!(error instanceof UnavailableLeaderboardError) || targetPeriod >= currentPeriod) throw error
                unavailable.push(error.details)
                console.warn(
                    `Skipping unavailable historical dungeon-period: ${error.message}. ` +
                    `No data saved or cleared for this dungeon-period. Check the mapping/provider availability, ` +
                    `then retry collectAndStoreRuns(${targetPeriod}).`
                )
            }
        }
    } finally {
        console.timeEnd(timer)
    }
    return unavailable
}

async function collectAndStoreRunsByDungeon(
    dungeon: Dungeon,
    regionConnectedRealms: RegionConnectedRealms[],
    period: number
) {
    console.log(`Collecting leaderboards for ${dungeon.name} for period ${period}`)
    const timer = `Collection & storage of ${dungeon.name} runs for period ${period}`
    console.time(timer)
    try {
        const leaderboards = await fetchLeaderboards(regionConnectedRealms, dungeon.id, period)
        const uniqueRuns = getUniqueRuns(leaderboards)
        if (uniqueRuns.length === 0) {
            console.log(`No eligible runs for dungeon ${dungeon.id}, period ${period}; leaving stored data unchanged`)
            return
        }
        const uniqueCharacters = getUniqueCharacters(uniqueRuns)
        await saveLeaderboardData(uniqueRuns, dungeon.id, period, uniqueCharacters)
    } finally {
        console.timeEnd(timer)
    }
}

const fetchLeaderboards = async (
    regionConnectedRealms: RegionConnectedRealms[],
    dungeonID: number,
    currentPeriod: number
) => {
    const allResults: LeadingGroup[] = []

    for (const rcr of regionConnectedRealms) {
        const timer = `Fetched leaderboards for region ${rcr.region}, dungeon ${dungeonID}, period ${currentPeriod}`
        console.time(timer)
        try {
            // Drain the batch before rejecting; never save partial regional aggregates.
            const results = await Promise.allSettled(
                rcr.realms.map((id) =>
                    getMythicLeaderboardByDungeonAndPeriod(id, dungeonID, currentPeriod, rcr.region)
                )
            )
            const first = results[0]
            if (
                first?.status === 'rejected' &&
                first.reason instanceof BNetRequestError &&
                first.reason.status === 404 &&
                results.every(
                    (result) => result.status === 'rejected' &&
                        result.reason instanceof BNetRequestError && result.reason.status === 404
                )
            ) {
                throw new UnavailableLeaderboardError({
                    region: rcr.region,
                    dungeon: dungeonID,
                    period: currentPeriod,
                    realmCount: results.length,
                    exampleUrl: first.reason.path,
                })
            }
            const failures: string[] = []
            for (const [index, result] of results.entries()) {
                if (result.status === 'rejected') {
                    const reason = result.reason instanceof Error ? result.reason.message : String(result.reason)
                    failures.push(`realm ${rcr.realms[index]}: ${reason}`)
                } else {
                    for (const run of result.value.leading_groups) allResults.push(run)
                }
            }
            if (failures.length > 0) {
                throw new Error(
                    `Incomplete collection for region ${rcr.region}, dungeon ${dungeonID}, period ${currentPeriod}: ` +
                    `${failures.length}/${rcr.realms.length} realms failed. No data saved for this dungeon-period. ` +
                    `Retry collectAndStoreRuns(${currentPeriod}) after resolving the API failure.\n${failures.join('\n')}`
                )
            }
            console.log(`Fetched ${results.length}/${rcr.realms.length} leaderboards for region ${rcr.region}`)
        } finally {
            console.timeEnd(timer)
        }
    }

    console.log(`Fetched leaderboards containing ${allResults.length} runs`)
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
    dungeon: DungeonId,
    period: number,
    uniqueCharacters: Member[]
) {
    console.time(`Inserting data for dungeon ${dungeon} during period ${period}`)
    // If development environment, insert all characters and runs
    if (process.env.ENVIRONMENT === 'development') {
        await prepareRunsInsert(uniqueRuns, dungeon, period)
        await prepCharacterInsert(uniqueCharacters)
    }
    await prepKeystoneFrequencyInsert(uniqueRuns, dungeon, period)
    console.timeEnd(`Inserting data for dungeon ${dungeon} during period ${period}`)
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

async function prepareRunsInsert(uniqueRuns: LeadingGroup[], dungeonID: DungeonId, currentPeriod: number) {
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
                devourer: 0,
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
