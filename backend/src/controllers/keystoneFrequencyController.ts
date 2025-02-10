import { Request, Response } from 'express'
import { getKeystoneFrequencyReport } from '../services/countKeystoneService'

export const fetchKeystoneFrequency = async (req: Request, res: Response): Promise<void> => {
    return getKeystoneFrequencyReport()
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch keystone frequency report' })
            Promise.reject(error)
        })
}
