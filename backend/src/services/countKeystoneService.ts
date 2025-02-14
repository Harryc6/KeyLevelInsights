import pool from '../utils/db'
import { getCurrentPeriod } from './mythicKeystoneService'
import {
    DungeonFrequency,
    FrequencyReport,
    KeystoneLevelFrequency,
    PeriodFrequencyReport,
    SpecFrequencyReport,
} from '../types/kli/KeyLevelFrequency'
import { dungeonIDs } from '../types/kli/map'

export const getSpecFrequencyReport = async (period?: number): Promise<SpecFrequencyReport[]> => {
    const query = `
        SELECT b.spec, a.keystone_level, count(a.keystone_level) as runs
        FROM runs a
        LEFT JOIN characters b ON b.character_id = ANY(a.tank) OR b.character_id = ANY(a.healer) OR b.character_id = ANY(a.dps)
        ${period ? 'WHERE period = $1' : ''}
        GROUP BY b.spec, keystone_level
        ORDER BY b.spec, keystone_level
    `
    try {
        const result = await pool.query<SpecFrequencyReport>(query, period ? [period] : [])
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
