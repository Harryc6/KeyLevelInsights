import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import rateLimitRoutes from './routes/rateLimitRoutes'
import connectedRealmRoutes from './routes/connectedRealmRoutes'
import mythicKeystoneRoutes from './routes/mythicKeystoneRoutes'
import mythicLeaderboardRoutes from './routes/mythicLeaderboardRoutes'
import { collectAndStoreRuns } from './services/dataCollectionService'
import cron from 'node-cron'
import keystoneFrequencyRoutes from './routes/keystoneFrequencyRoutes'
import { getCurrentPeriod } from './services/mythicKeystoneService'

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

// KLI routes
app.use(`/api`, keystoneFrequencyRoutes)

// Define a simple route to test the server
app.get('/', (req: Request, res: Response) => {
    // const val = executeBNetQuery(bNetPathBuilder(`/keystone-affix/index`, undefined, undefined, `static-eu`))
    // Promise.resolve(val).then((val) => res.send(JSON.stringify(val, null, 2)))
    res.send('Hello, World!')
})

// Schedule a job to run collectAndStoreRuns() every hour
cron.schedule('0 * * * *', () => {
    console.log('Running collectAndStoreRuns() job...')
    collectAndStoreRuns().catch((err) => console.error(err))
})

// Schedule a job to run collectAndStoreRuns(previousPeriod) every week on a Wednesday at 09:00
cron.schedule('0 9 * * 3', () => {
    console.log('Running collectAndStoreRuns() job for previous period...')
    getCurrentPeriod()
        .then((period) => collectAndStoreRuns(period - 1))
        .catch((err) => console.error(err))
})

// collectAndStoreRuns()
// updateAllExpansionsRuns()

// Start the server and listen on the specified port
const PORT = parseInt(process.env.PORT || '5000')
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

module.exports = app
