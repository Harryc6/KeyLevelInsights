import pool from '../utils/db'
import { DungeonFrequency, KeystoneLevelFrequency } from '../types/kli/KeyLevelFrequency'
import { SpecFrequency } from '../models/keystoneFrequency'

export const getSpecFrequencyReport = async (period: number, dungeon?: number): Promise<SpecFrequency[]> => {
    const query = `SELECT
                       keystone_level,
                       cast(SUM(arcane) as integer) AS arcane,
                       cast(SUM(fire) as integer) AS fire,
                       cast(SUM(frost_mage) as integer) AS frost_mage,
                       cast(SUM(holy_paladin) as integer) AS holy_paladin,
                       cast(SUM(protection_paladin) as integer) AS protection_paladin,
                       cast(SUM(retribution) as integer) AS retribution ,
                       cast(SUM(arms) as integer) AS arms ,
                       cast(SUM(fury) as integer) AS fury,
                       cast(SUM(protection_warrior) as integer) AS protection_warrior,
                       cast(SUM(balance) as integer) AS balance,
                       cast(SUM(feral) as integer) AS feral,
                       cast(SUM(guardian) as integer) AS guardian,
                       cast(SUM(restoration_druid) as integer) AS restoration_druid,
                       cast(SUM(blood) as integer) AS blood,
                       cast(SUM(frost_death_knight) as integer) AS frost_death_knight,
                       cast(SUM(unholy) as integer) AS unholy,
                       cast(SUM(beast_mastery) as integer) AS beast_mastery,
                       cast(SUM(marksmanship) as integer) AS marksmanship,
                       cast(SUM(survival) as integer) AS survival,
                       cast(SUM(discipline) as integer) AS discipline,
                       cast(SUM(holy_priest) as integer) AS holy_priest,
                       cast(SUM(shadow) as integer) AS shadow,
                       cast(SUM(assassination) as integer) AS assassination,
                       cast(SUM(outlaw) as integer) AS outlaw,
                       cast(SUM(subtlety) as integer) AS subtlety,
                       cast(SUM(elemental) as integer) AS elemental,
                       cast(SUM(enhancement) as integer) AS enhancement,
                       cast(SUM(restoration_shaman) as integer) AS restoration_shaman,
                       cast(SUM(affliction) as integer) AS affliction,
                       cast(SUM(demonology) as integer) AS demonology,
                       cast(SUM(destruction) as integer) AS destruction,
                       cast(SUM(brewmaster) as integer) AS brewmaster,
                       cast(SUM(windwalker) as integer) AS windwalker,
                       cast(SUM(mistweaver) as integer) AS mistweaver,
                       cast(SUM(havoc) as integer) AS havoc,
                       cast(SUM(vengeance) as integer) AS vengeance,
                       cast(SUM(devastation) as integer) AS devastation,
                       cast(SUM(preservation) as integer) AS preservation,
                       cast(SUM(augmentation) as integer) AS augmentation
                   FROM keystone_frequency
                   WHERE period = $1
                   ${dungeon ? 'AND dungeon = $2' : ''}
                   GROUP BY keystone_level
                   ORDER BY keystone_level;
    `

    const params = [period]
    if (dungeon) params.push(dungeon)

    try {
        const result = await pool.query<SpecFrequency>(query, params)
        return result.rows
    } catch (error) {
        console.error('Error fetching keystone report:', error)
        throw error
    }
}

export const getKeystoneFrequencyReport = async (
    period: number,
    dungeon?: number
): Promise<KeystoneLevelFrequency[]> => {
    const query = `
        select keystone_level, cast(sum(total_runs) as integer) as total_runs
        from keystone_frequency
        WHERE period = $1
        ${dungeon ? 'AND dungeon = $2' : ''}
        group by keystone_level order by keystone_level
    `
    const params = [period]
    if (dungeon) params.push(dungeon)

    try {
        return await pool.query(query, params).then((res) => {
            return res.rows.map((row) => {
                return {
                    keystoneLevel: row.keystone_level,
                    runs: row.total_runs,
                }
            })
        })
    } catch (error) {
        console.error('Error counting runs:', error)
        throw error
    }
}

export const getDungeonFrequencyReport = async (period: number): Promise<DungeonFrequency[]> => {
    const query = `
        select dungeon, cast(sum(total_runs) as integer) as runs from keystone_frequency
        WHERE period = $1
        group by dungeon order by dungeon
    `
    try {
        return await pool.query<DungeonFrequency>(query, [period]).then((res) => res.rows)
    } catch (error) {
        console.error('Error counting runs:', error)
        throw error
    }
}

export const getPeriods = async (): Promise<number[]> => {
    const query = `
        select distinct period from keystone_frequency order by period desc
    `
    try {
        return await pool.query(query).then((res) => res.rows.map((row) => row.period))
    } catch (error) {
        console.error('Error fetching periods:', error)
        throw error
    }
}
