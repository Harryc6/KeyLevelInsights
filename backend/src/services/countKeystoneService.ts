import pool from '../utils/db'
import { getCurrentPeriod } from './mythicKeystoneService'
import {
    DungeonFrequency,
    FrequencyReport,
    KeystoneLevelFrequency,
    PeriodFrequencyReport,
    SpecFrequency,
} from '../types/kli/KeyLevelFrequency'
import { dungeonIDs } from '../types/kli/map'

export const getSpecFrequencyReport = async (period?: number): Promise<SpecFrequency[]> => {
    const query = `
        WITH expanded_runs AS (
            SELECT
                a.keystone_level,
                cast(jsonb_array_elements(a.tank)->>'spec_id' as integer) AS spec_id
        FROM runs a
        ${period ? 'WHERE period = $1' : ''}

        UNION ALL
        SELECT
            a.keystone_level,
            cast(jsonb_array_elements(a.healer)->>'spec_id' as integer) AS spec_id
        FROM runs a
        ${period ? 'WHERE period = $1' : ''}

        UNION ALL
        SELECT
            a.keystone_level,
            cast(jsonb_array_elements(a.dps)->>'spec_id' as integer) spec_id
        FROM runs a
        ${period ? 'WHERE period = $1' : ''}
            )
        SELECT
            keystone_level,
            spec_id,
            COUNT(*) AS runs
        FROM expanded_runs
        GROUP BY keystone_level, spec_id
        ORDER BY keystone_level, spec_id
    `
    try {
        const result = await pool.query<SpecFrequency>(query, period ? [period] : [])
        return result.rows
    } catch (error) {
        console.error('Error fetching keystone report:', error)
        throw error
    }
}

export const getKeystoneFrequencyReport = async (): Promise<FrequencyReport> => {
    const highestKeystone = await getHighestKeystoneLevel()

    const currentPeriod = await getCurrentPeriod()
    const highestCurrentPeriodKeystone = await getHighestKeystoneLevel(currentPeriod)
    const highestLastPeriodKeystone = await getHighestKeystoneLevel(currentPeriod - 1)

    return {
        currentPeriod: await getPeriodFrequencyReport(highestCurrentPeriodKeystone, currentPeriod),
        lastPeriod: await getPeriodFrequencyReport(highestLastPeriodKeystone, currentPeriod - 1),
        allPeriods: await getPeriodFrequencyReport(highestKeystone),
    }
}

export const getHighestKeystoneLevel = async (period?: number): Promise<number> => {
    const query = `
        SELECT MAX(keystone_level) AS max
        FROM runs
        ${period ? 'WHERE period = $1' : ''}
    `
    try {
        const result = await pool.query(query, period ? [period] : [])
        return parseInt(result.rows[0].max)
    } catch (error) {
        console.error('Error fetching highest keystone level:', error)
        throw error
    }
}

const getPeriodFrequencyReport = async (highestKeystone: number, period?: number): Promise<PeriodFrequencyReport> => {
    const byKeystoneLevel = await getKeystoneLevelFrequency(highestKeystone, period)
    const byDungeon = await getDungeonFrequency(highestKeystone, period)
    const totalRuns = byKeystoneLevel.reduce((acc, curr) => acc + curr.runs, 0)
    return { byKeystoneLevel, byDungeon, totalRuns }
}

const getKeystoneLevelFrequency = async (
    highestKeystone: number,
    period?: number
): Promise<KeystoneLevelFrequency[]> => {
    const frequency: KeystoneLevelFrequency[] = []
    for (let i = 2; i <= highestKeystone; i++) {
        const runs = await countRunsAtKeystoneLevel(i, period)
        frequency.push({ keystoneLevel: i, runs })
    }
    return frequency
}

const getDungeonFrequency = async (highestKeystone: number, period?: number): Promise<DungeonFrequency[]> => {
    const frequency: DungeonFrequency[] = []
    for (const dungeon of dungeonIDs) {
        const byKeystoneLevel: KeystoneLevelFrequency[] = []
        for (let i = 2; i <= highestKeystone; i++) {
            const runs = await countRunsAtKeystoneLevel(i, period, dungeon)
            byKeystoneLevel.push({ keystoneLevel: i, runs })
        }
        frequency.push({ byKeystoneLevel, dungeon })
    }
    return frequency
}

export const countRunsAtKeystoneLevel = async (
    keystoneLevel: number,
    period?: number,
    dungeon?: number
): Promise<number> => {
    const query = `
        SELECT COUNT(*) AS count
        FROM runs
        WHERE keystone_level = $1
        ${dungeon ? 'AND dungeon = $2' : ''}
        ${period ? `AND period = $${dungeon ? 3 : 2}` : ''}
    `
    try {
        const params = [keystoneLevel]
        if (dungeon) params.push(dungeon)
        if (period) params.push(period)
        const result = await pool.query(query, params)
        return parseInt(result.rows[0].count)
    } catch (error) {
        console.error('Error counting runs:', error)
        throw error
    }
}
