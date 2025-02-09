import pool from '../utils/db'
import { Character } from '../types/kli/character'
import { Run } from '../types/kli/run'

export const insertRuns = async (runs: Run[]): Promise<void> => {
    const BATCH_SIZE = 1000
    console.log('Inserting runs...')
    for (let i = 0; i < runs.length; i += BATCH_SIZE) {
        const batch = runs.slice(i, i + BATCH_SIZE)
        await insertBatch(batch)
    }
    console.log(`Inserted ${runs.length} runs`)
}

async function insertBatch(batch: Run[]) {
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
        run.tank,
        run.healer,
        run.dps,
    ])

    try {
        await pool.query(query, values)
    } catch (error) {
        console.error('Error inserting runs:', error)
    }
}

export const insertCharacters = async (character: Character[]): Promise<void> => {
    const BATCH_SIZE = 1000
    console.log('Inserting characters...')
    for (let i = 0; i < character.length; i += BATCH_SIZE) {
        const batch = character.slice(i, i + BATCH_SIZE)
        await insertCharacterBatch(batch)
    }
    console.log(`Inserted ${character.length} characters`)
}

async function insertCharacterBatch(batch: Character[]) {
    const query = `
        INSERT INTO characters (character_id, name, realm)
        VALUES ${batch.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')}
            ON CONFLICT (character_id) DO NOTHING
    `

    const values = batch.flatMap((character) => [character.character_id, character.name, character.realm])

    try {
        await pool.query(query, values)
    } catch (error) {
        console.error('Error inserting characters:', error)
    }
}
