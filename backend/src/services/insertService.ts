import pool from '../utils/db'
import { Character } from '../types/kli/character'
import { Run } from '../types/kli/run'
import { DBKeystoneFrequency } from '../models/keystoneFrequency'

export const insertRuns = async (runs: Run[]): Promise<void> => {
    const BATCH_SIZE = 1000
    let totalInserted = 0
    for (let i = 0; i < runs.length; i += BATCH_SIZE) {
        const batch = runs.slice(i, i + BATCH_SIZE)
        totalInserted += await insertRunsBatch(batch)
    }
    console.log(`Inserted ${totalInserted} / ${runs.length} new runs`)
}

async function insertRunsBatch(batch: Run[]) {
    const query = `
        INSERT INTO runs (dungeon, keystone_level, rating, duration, completed_timestamp, period, tank, healer, dps)
        VALUES ${batch.map((_, i) => `($${i * 9 + 1}, $${i * 9 + 2}, $${i * 9 + 3}, $${i * 9 + 4}, $${i * 9 + 5}, $${i * 9 + 6}, $${i * 9 + 7}, $${i * 9 + 8}, $${i * 9 + 9})`).join(', ')}
            ON CONFLICT (dungeon, keystone_level, rating, duration, completed_timestamp, period, tank, healer, dps) DO NOTHING
    `

    const values = batch.flatMap((run) => [
        run.dungeon,
        run.keystone_level,
        run.rating,
        run.duration,
        run.completed_timestamp,
        run.period,
        JSON.stringify(run.tank),
        JSON.stringify(run.healer),
        JSON.stringify(run.dps),
    ])

    try {
        const result = await pool.query(query, values)
        return result.rowCount ?? 0
    } catch (error) {
        console.error('Error inserting runs:', error)
        return 0
    }
}

export const insertCharacters = async (character: Character[]): Promise<void> => {
    const BATCH_SIZE = 1000
    let totalInserted = 0
    for (let i = 0; i < character.length; i += BATCH_SIZE) {
        const batch = character.slice(i, i + BATCH_SIZE)
        totalInserted += await insertCharacterBatch(batch)
    }
    console.log(`Inserted ${totalInserted} / ${character.length} new characters`)
    return Promise.resolve()
}

async function insertCharacterBatch(batch: Character[]) {
    const query = `
        INSERT INTO characters (character_id, name, realm, spec)
        VALUES ${batch.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(', ')}
            ON CONFLICT (character_id, spec) DO NOTHING
    `

    const values = batch.flatMap((character) => [
        character.character_id,
        character.name,
        character.realm,
        character.spec,
    ])

    try {
        const result = await pool.query(query, values)
        return result.rowCount ?? 0
    } catch (error) {
        console.error('Error inserting characters:', error)
        return 0
    }
}

export const insertKeystoneFrequency = async (keystoneFrequencies: DBKeystoneFrequency[]): Promise<void> => {
    const query = `
        INSERT INTO keystone_frequency (
            keystone_level, arcane, fire, frost_mage, holy_paladin, protection_paladin, retribution, arms, fury, protection_warrior, balance, feral, guardian, restoration_druid, blood, frost_death_knight, unholy, beast_mastery, marksmanship, survival, discipline, holy_priest, shadow, assassination, outlaw, subtlety, elemental, enhancement, restoration_shaman, affliction, demonology, destruction, brewmaster, windwalker, mistweaver, havoc, vengeance, devastation, preservation, augmentation, period, dungeon, total_runs
        ) VALUES ${keystoneFrequencies
            .map((_, i) => {
                const offset = i * 43
                return `(
                        $${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10},
                        $${offset + 11}, $${offset + 12}, $${offset + 13}, $${offset + 14}, $${offset + 15}, $${offset + 16}, $${offset + 17}, $${offset + 18}, $${offset + 19}, $${offset + 20},
                        $${offset + 21}, $${offset + 22}, $${offset + 23}, $${offset + 24}, $${offset + 25}, $${offset + 26}, $${offset + 27}, $${offset + 28}, $${offset + 29}, $${offset + 30},
                        $${offset + 31}, $${offset + 32}, $${offset + 33}, $${offset + 34}, $${offset + 35}, $${offset + 36}, $${offset + 37}, $${offset + 38}, $${offset + 39}, $${offset + 40},
                        $${offset + 41}, $${offset + 42}, $${offset + 43}
                    )`
            })
            .join(', ')}
            ON CONFLICT (keystone_level, period, dungeon) DO UPDATE SET
            arcane = EXCLUDED.arcane,
            fire = EXCLUDED.fire,
            frost_mage = EXCLUDED.frost_mage,
            holy_paladin = EXCLUDED.holy_paladin,
            protection_paladin = EXCLUDED.protection_paladin,
            retribution = EXCLUDED.retribution,
            arms = EXCLUDED.arms,
            fury = EXCLUDED.fury,
            protection_warrior = EXCLUDED.protection_warrior,
            balance = EXCLUDED.balance,
            feral = EXCLUDED.feral,
            guardian = EXCLUDED.guardian,
            restoration_druid = EXCLUDED.restoration_druid,
            blood = EXCLUDED.blood,
            frost_death_knight = EXCLUDED.frost_death_knight,
            unholy = EXCLUDED.unholy,
            beast_mastery = EXCLUDED.beast_mastery,
            marksmanship = EXCLUDED.marksmanship,
            survival = EXCLUDED.survival,
            discipline = EXCLUDED.discipline,
            holy_priest = EXCLUDED.holy_priest,
            shadow = EXCLUDED.shadow,
            assassination = EXCLUDED.assassination,
            outlaw = EXCLUDED.outlaw,
            subtlety = EXCLUDED.subtlety,
            elemental = EXCLUDED.elemental,
            enhancement = EXCLUDED.enhancement,
            restoration_shaman = EXCLUDED.restoration_shaman,
            affliction = EXCLUDED.affliction,
            demonology = EXCLUDED.demonology,
            destruction = EXCLUDED.destruction,
            brewmaster = EXCLUDED.brewmaster,
            windwalker = EXCLUDED.windwalker,
            mistweaver = EXCLUDED.mistweaver,
            havoc = EXCLUDED.havoc,
            vengeance = EXCLUDED.vengeance,
            devastation = EXCLUDED.devastation,
            preservation = EXCLUDED.preservation,
            augmentation = EXCLUDED.augmentation,
            total_runs = EXCLUDED.total_runs;
    `

    const values = keystoneFrequencies.flatMap((kf) => [
        kf.keystone_level,
        kf.arcane,
        kf.fire,
        kf.frost_mage,
        kf.holy_paladin,
        kf.protection_paladin,
        kf.retribution,
        kf.arms,
        kf.fury,
        kf.protection_warrior,
        kf.balance,
        kf.feral,
        kf.guardian,
        kf.restoration_druid,
        kf.blood,
        kf.frost_death_knight,
        kf.unholy,
        kf.beast_mastery,
        kf.marksmanship,
        kf.survival,
        kf.discipline,
        kf.holy_priest,
        kf.shadow,
        kf.assassination,
        kf.outlaw,
        kf.subtlety,
        kf.elemental,
        kf.enhancement,
        kf.restoration_shaman,
        kf.affliction,
        kf.demonology,
        kf.destruction,
        kf.brewmaster,
        kf.windwalker,
        kf.mistweaver,
        kf.havoc,
        kf.vengeance,
        kf.devastation,
        kf.preservation,
        kf.augmentation,
        kf.period,
        kf.dungeon,
        kf.total_runs,
    ])

    try {
        await pool.query(query, values)
    } catch (error) {
        console.error('Error inserting keystone frequency:', error)
    }
}
