import { Request, Response } from 'express'
import {
    getMythicKeystoneDungeonsIndex,
    getMythicKeystonePeriodIndex,
    getMythicKeystoneSeasonIndex,
} from '../services/mythicKeystoneService'

export const fetchMythicKeystoneDungeons = async (req: Request, res: Response): Promise<void> => {
    return getMythicKeystoneDungeonsIndex()
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone dungeons' })
            Promise.reject(error)
        })
}

export const fetchMythicKeystonePeriods = async (req: Request, res: Response): Promise<void> => {
    return getMythicKeystonePeriodIndex()
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone periods' })
            Promise.reject(error)
        })
}

export const fetchMythicKeystoneSeasons = async (req: Request, res: Response): Promise<void> => {
    return getMythicKeystoneSeasonIndex()
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone seasons' })
            Promise.reject(error)
        })
}
