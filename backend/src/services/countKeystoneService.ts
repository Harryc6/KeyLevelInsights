import pool from '../utils/db'
import { KeystoneLevelFrequency, SpecFrequency } from '../types/kli/KeyLevelFrequency'

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

export const getKeystoneFrequencyReport = async (
    period?: number,
    dungeon?: number
): Promise<KeystoneLevelFrequency[]> => {
    const query = `
        select keystone_level as keystoneLevel, count(keystone_level) as runs
        from runs
        ${period ? 'WHERE period = $1' : ''}
        ${period && dungeon ? 'AND dungeon = $2' : ''}
        ${dungeon && !period ? 'WHERE dungeon = $1' : ''}                                               
        group by keystone_level order by keystone_level
    `
    const params = []
    if (period) params.push(period)
    if (dungeon) params.push(dungeon)

    try {
        return await pool.query<KeystoneLevelFrequency>(query, params).then((res) => res.rows)
    } catch (error) {
        console.error('Error counting runs:', error)
        throw error
    }
}
