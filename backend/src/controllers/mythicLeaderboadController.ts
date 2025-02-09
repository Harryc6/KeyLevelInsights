import { Request, Response } from 'express'
import { getMythicLeaderboardByDungeonAndPeriod, getMythicLeaderboardIndex } from '../services/mythicLeaderboadService'
import { getCurrentPeriod } from '../services/mythicKeystoneService'

export const fetchMythicLeaderboard = async (req: Request, res: Response): Promise<void> => {
    const connectedRealmId = parseInt(req.params.connectedRealmId)
    return getMythicLeaderboardIndex(connectedRealmId)
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone dungeons' })
            Promise.reject(error)
        })
}

export const fetchMythicLeaderboardByDungeonAndPeriod = async (req: Request, res: Response): Promise<void> => {
    const connectedRealmId = parseInt(req.params.connectedRealmId)
    const dungeonId = parseInt(req.params.dungeonId)
    const period = parseInt(req.params.period)
    return getMythicLeaderboardByDungeonAndPeriod(connectedRealmId, dungeonId, period)
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone dungeons' })
            Promise.reject(error)
        })
}

export const fetchCurrentMythicLeaderboardDungeonByDungeon = async (req: Request, res: Response): Promise<void> => {
    const connectedRealmId = parseInt(req.params.connectedRealmId)
    const dungeonId = parseInt(req.params.dungeonId)
    const currentPeriod = await getCurrentPeriod()

    return getMythicLeaderboardByDungeonAndPeriod(connectedRealmId, dungeonId, currentPeriod)
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone dungeons' })
            Promise.reject(error)
        })
}
