import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import rateLimitRoutes from './routes/rateLimitRoutes'
import { bNetPathBuilder, executeBNetQuery } from './utils/bNetQuery'
import connectedRealmRoutes from './routes/connectedRealmRoutes'
import mythicKeystoneRoutes from './routes/mythicKeystoneRoutes'
import mythicLeaderboardRoutes from './routes/mythicLeaderboardRoutes'
import { collectAndStoreRuns } from './services/dataCollectionService'
import cron from 'node-cron'

// Load environment variables from .env file
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// WCL routes
app.use('/api', rateLimitRoutes)

// BNet routes
app.use(`/api`, connectedRealmRoutes)
app.use(`/api`, mythicKeystoneRoutes)
app.use(`/api`, mythicLeaderboardRoutes)

// Define a simple route to test the server
app.get('/', (req: Request, res: Response) => {
    const val = executeBNetQuery(bNetPathBuilder(`/keystone-affix/index`, undefined, undefined, `static-eu`))
    Promise.resolve(val).then((val) => res.send(JSON.stringify(val, null, 2)))
})

// Schedule a job to run collectAndStoreRuns() every hour
cron.schedule('0 * * * *', () => {
    console.log('Running collectAndStoreRuns() job...')
    collectAndStoreRuns()
})

// Start the server and listen on the specified port
const PORT = parseInt(process.env.PORT || '5000')
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
