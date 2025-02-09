import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import rateLimitRoutes from './routes/rateLimitRoutes'
import { bNetPathBuilder, executeBNetQuery } from './utils/bNetQuery'
import connectedRealmRoutes from './routes/connectedRealmRoutes'
import mythicKeystoneRoutes from './routes/mythicKeystoneRoutes'
import mythicLeaderboardRoutes from './routes/mythicLeaderboardRoutes'
import { getConnectedRealmIDs } from './services/connectedRealmService'
import { getCurrentPeriod } from './services/mythicKeystoneService'
import { getMythicLeaderboardByDungeonAndPeriod as originalGetMythicLeaderboardByDungeonAndPeriod } from './services/mythicLeaderboadService'
import Bottleneck from 'bottleneck'

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

app.get('/', (req: Request, res: Response) => {
    const val = executeBNetQuery(bNetPathBuilder(`/keystone-affix/index`, undefined, undefined, `static-eu`))
    Promise.resolve(val).then((val) => res.send(JSON.stringify(val, null, 2)))
})

// Create a rate limiter
const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 1000 / 300, // 200 queries per second
})

// Wrap your API call with the limiter
const getMythicLeaderboardByDungeonAndPeriod = limiter.wrap(originalGetMythicLeaderboardByDungeonAndPeriod)

enum CurrentDungeon {
    AraKara = 503,
    Stonevault = 501,
    DawnBreaker = 505,
    GrimBatol = 507,
    CityOfThreads = 502,
    NecroticWake = 1182,
    MistOfTirnaScithe = 1184,
}

const dungeonIDs = [
    CurrentDungeon.AraKara,
    CurrentDungeon.Stonevault,
    CurrentDungeon.DawnBreaker,
    CurrentDungeon.GrimBatol,
    CurrentDungeon.CityOfThreads,
    CurrentDungeon.NecroticWake,
    CurrentDungeon.MistOfTirnaScithe,
]

Promise.all([getConnectedRealmIDs(), getCurrentPeriod()]).then(([connectedRealmIDs, currentPeriod]) => {
    console.log(`Connected realms: ${connectedRealmIDs.length}`)
    console.log(`Current period: ${currentPeriod}`)

    // Get the leaderboard for each dungeon by combining the top run of each realm
    const firstDungeonID = dungeonIDs[0]
    Promise.all(
        connectedRealmIDs.map(async (connectedRealmID) => {
            const val = await getMythicLeaderboardByDungeonAndPeriod(connectedRealmID, firstDungeonID, currentPeriod)
            return val.leading_groups
        })
    ).then((leaderboards) => {
        const sortedBoards = leaderboards
            .flatMap((value) => value)
            // sort the runs by key level the mythic rating of the run
            .sort((a, b) => {
                if (a.keystone_level === b.keystone_level) {
                    return b.mythic_rating.rating - a.mythic_rating.rating
                }
                return b.keystone_level - a.keystone_level
            })

        // filter out any runs that are the same run but from different realms (i.e. duplicates)
        const uniqueRuns = sortedBoards
            .filter((value) => value !== undefined) // Filter out undefined values
            .filter((value, index, self) => {
                const firstInstance = self.findIndex(
                    (run) =>
                        run.mythic_rating.rating === value.mythic_rating?.rating &&
                        run?.duration === value?.duration &&
                        run.keystone_level === value.keystone_level &&
                        run.completed_timestamp === value.completed_timestamp &&
                        run.members.every((member, index) => member.profile.name === value.members[index].profile.name)
                )
                return firstInstance === index
            })

        console.log(`Leaderboard for dungeon Ara-kara (${firstDungeonID}) for period ${currentPeriod}`)
        console.log(`Total connected realms: ${connectedRealmIDs.length}`)
        console.log(`Total runs: ${sortedBoards.length}`)
        console.log(`Unique runs: ${uniqueRuns.length}`)
    })
})

const PORT = parseInt(process.env.PORT || '5000')
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
