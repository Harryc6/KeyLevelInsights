import { Pool } from 'pg'
import dotenv from 'dotenv'

// Load environment variables from .env file to make sure that the process.env object is populated
dotenv.config()

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
})

pool.on('connect', () => {
    console.log('Connected to the database')
})

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

export default pool
