import { Request, Response } from 'express'
import { getKeystoneFrequencyReport, getSpecFrequencyReport } from '../services/countKeystoneService'

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

export const fetchSpecFrequency = async (req: Request, res: Response): Promise<void> => {
    const period = parseInt(req.params.period)
    return getSpecFrequencyReport(period)
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch spec frequency report' })
            Promise.reject(error)
        })
}
