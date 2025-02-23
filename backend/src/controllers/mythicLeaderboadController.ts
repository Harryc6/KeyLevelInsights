import { Request, Response } from 'express'
import { getMythicLeaderboardByDungeonAndPeriod, getMythicLeaderboardIndex } from '../services/mythicLeaderboadService'
import { getCurrentPeriod } from '../services/mythicKeystoneService'
import { dungeonMap } from '../types/kli/map'

export const fetchMythicLeaderboard = async (req: Request, res: Response): Promise<void> => {
    const connectedRealmId = parseInt(req.params.connectedRealmId)
    console.time(`Fetching leaderboard index for connected realm ${connectedRealmId}`)
    return getMythicLeaderboardIndex(connectedRealmId)
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone dungeons' })
            Promise.reject(error)
        })
        .then(() => {
            console.timeEnd(`Fetching leaderboard index for connected realm ${connectedRealmId}`)
        })
}

export const fetchMythicLeaderboardByDungeonAndPeriod = async (req: Request, res: Response): Promise<void> => {
    const connectedRealmId = parseInt(req.params.connectedRealmId)
    const dungeonId = parseInt(req.params.dungeonId)
    const period = parseInt(req.params.period)
    console.time(
        `Fetching leaderboard for ${dungeonMap.get(dungeonId)} for period ${period} for connected realm ${connectedRealmId}`
    )
    return getMythicLeaderboardByDungeonAndPeriod(connectedRealmId, dungeonId, period)
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone dungeons' })
            Promise.reject(error)
        })
        .finally(() => {
            console.timeEnd(
                `Fetching leaderboard for ${dungeonMap.get(dungeonId)} for period ${period} for connected realm ${connectedRealmId}`
            )
        })
}

export const fetchCurrentMythicLeaderboardDungeonByDungeon = async (req: Request, res: Response): Promise<void> => {
    const connectedRealmId = parseInt(req.params.connectedRealmId)
    const dungeonId = parseInt(req.params.dungeonId)
    console.time(
        `Fetching leaderboard for ${dungeonMap.get(dungeonId)} for the current period for connected realm ${connectedRealmId}`
    )
    const currentPeriod = await getCurrentPeriod()
    return getMythicLeaderboardByDungeonAndPeriod(connectedRealmId, dungeonId, currentPeriod)
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone dungeons' })
            Promise.reject(error)
        })
        .finally(() => {
            console.timeEnd(
                `Fetching leaderboard for ${dungeonMap.get(dungeonId)} for the current period for connected realm ${connectedRealmId}`
            )
        })
}
