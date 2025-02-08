import { Request, Response } from 'express'
import { getConnectedRealmByID, getConnectedRealmNames, getConnectRealmsIndex } from '../services/connectedRealmService'

export const fetchConnectedRealms = async (req: Request, res: Response): Promise<void> => {
    return getConnectRealmsIndex()
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch connected realms' })
            Promise.reject(error)
        })
}

export const fetchSpecificConnectedRealm = async (req: Request, res: Response): Promise<void> => {
    const connectedRealmId = parseInt(req.params.connectedRealmId)
    return getConnectedRealmByID(connectedRealmId)
        .then((connectedRealm) => {
            res.json(connectedRealm)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch connected realm' })
            Promise.reject(error)
        })
}

export const fetchConnectedRealmNames = async (req: Request, res: Response): Promise<void> => {
    return getConnectedRealmNames()
        .then((realmNames) => {
            res.json(realmNames)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch connected realm names' })
            Promise.reject(error)
        })
}
