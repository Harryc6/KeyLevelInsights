import { Request, Response } from 'express'
import {
    getMythicKeystoneDungeonsIndex,
    getMythicKeystonePeriodIndex,
    getMythicKeystoneSeasonIndex,
} from '../services/mythicKeystoneService'

export const fetchMythicKeystoneDungeons = async (req: Request, res: Response): Promise<void> => {
    console.time('Fetching mythic keystone dungeons')
    return getMythicKeystoneDungeonsIndex()
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone dungeons' })
            Promise.reject(error)
        })
        .finally(() => {
            console.timeEnd('Fetching mythic keystone dungeons')
        })
}

export const fetchMythicKeystonePeriods = async (req: Request, res: Response): Promise<void> => {
    console.time('Fetching mythic keystone periods')
    return getMythicKeystonePeriodIndex()
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone periods' })
            Promise.reject(error)
        })
        .finally(() => {
            console.timeEnd('Fetching mythic keystone periods')
        })
}

export const fetchMythicKeystoneSeasons = async (req: Request, res: Response): Promise<void> => {
    console.time('Fetching mythic keystone seasons')
    return getMythicKeystoneSeasonIndex()
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch mythic keystone seasons' })
            Promise.reject(error)
        })
        .finally(() => {
            console.timeEnd('Fetching mythic keystone seasons')
        })
}
