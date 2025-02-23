import { Request, Response } from 'express'
import {
    getConnectedRealmByID,
    getConnectedRealmIDs,
    getConnectedRealmNames,
    getConnectRealmsIndex,
} from '../services/connectedRealmService'

export const fetchConnectedRealms = async (req: Request, res: Response): Promise<void> => {
    console.time('Fetching connected realms')
    return getConnectRealmsIndex()
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch connected realms' })
            Promise.reject(error)
        })
        .finally(() => {
            console.timeEnd('Fetching connected realms')
        })
}

export const fetchSpecificConnectedRealm = async (req: Request, res: Response): Promise<void> => {
    const connectedRealmId = parseInt(req.params.connectedRealmId)
    console.time(`Fetching connected realm ${connectedRealmId}`)
    return getConnectedRealmByID(connectedRealmId)
        .then((connectedRealm) => {
            res.json(connectedRealm)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch connected realm' })
            Promise.reject(error)
        })
        .finally(() => {
            console.timeEnd(`Fetching connected realm ${connectedRealmId}`)
        })
}

export const fetchConnectedRealmNames = async (req: Request, res: Response): Promise<void> => {
    console.time('Fetching connected realm names')
    return getConnectedRealmNames()
        .then((realmNames) => {
            res.json(realmNames)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch connected realm names' })
            Promise.reject(error)
        })
        .finally(() => {
            console.timeEnd('Fetching connected realm names')
        })
}

export const fetchConnectedRealmIDs = async (req: Request, res: Response): Promise<void> => {
    console.time('Fetching connected realm IDs')
    return getConnectedRealmIDs()
        .then((realmIDs) => {
            res.json(realmIDs)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch connected realm IDs' })
            Promise.reject(error)
        })
        .finally(() => {
            console.timeEnd('Fetching connected realm IDs')
        })
}
