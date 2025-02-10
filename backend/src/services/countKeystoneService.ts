import pool from '../utils/db'
import { getCurrentPeriod } from './mythicKeystoneService'
import {
    DungeonFrequency,
    FrequencyReport,
    KeystoneLevelFrequency,
    PeriodFrequencyReport,
} from '../types/kli/KeyLevelFrequency'
import { dungeonIDs } from '../types/kli/map'

export const countRunsAtKeystoneLevel = async (keystoneLevel: number, period?: number): Promise<number> => {
    const query = `
        SELECT COUNT(*) AS count
        FROM runs
        WHERE keystone_level = $1 ${period ? 'AND period = $2' : ''}
    `
    try {
        const result = await pool.query(query, period ? [keystoneLevel, period] : [keystoneLevel])
        return parseInt(result.rows[0].count, 10)
    } catch (error) {
        console.error('Error counting runs at keystone level:', error)
        throw error
    }
}

export const countRunsAtKeystoneLevelAndDungeon = async (
    keystoneLevel: number,
    dungeon: number,
    period?: number
): Promise<number> => {
    const query = `
        SELECT COUNT(*) AS count
        FROM runs
        WHERE keystone_level = $1 AND dungeon = $2 ${period ? 'AND period = $3' : ''}
    `
    try {
        const result = await pool.query(query, period ? [keystoneLevel, dungeon, period] : [keystoneLevel, dungeon])
        return parseInt(result.rows[0].count, 10)
    } catch (error) {
        console.error('Error counting runs at keystone level and dungeon:', error)
        throw error
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
            const runs = await countRunsAtKeystoneLevelAndDungeon(i, dungeon, period)
            byKeystoneLevel.push({ keystoneLevel: i, runs })
        }
        frequency.push({ byKeystoneLevel, dungeon })
    }
    return frequency
}
