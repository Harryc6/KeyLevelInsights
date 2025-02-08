import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import rateLimitRoutes from './routes/rateLimitRoutes'
import { bNetPathBuilder, executeBNetQuery } from './utils/bNetQuery'
import connectedRealmRoutes from './routes/connectedRealmRoutes'

// Load environment variables from .env file
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', rateLimitRoutes)

app.use(`/api`, connectedRealmRoutes)

app.get('/', (req: Request, res: Response) => {
    const val = executeBNetQuery(bNetPathBuilder(`/keystone-affix/index`, undefined, undefined, `static-eu`))
    Promise.resolve(val).then((val) => res.send(JSON.stringify(val, null, 2)))
})

const PORT = parseInt(process.env.PORT || '5000')
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
