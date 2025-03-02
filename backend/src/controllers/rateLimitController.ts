import { Request, Response } from 'express'
import { getRateLimitData } from '../services/rateLimitService'

export const fetchRateLimitData = async (req: Request, res: Response): Promise<void> => {
    console.time('Fetching rate limit data')
    return getRateLimitData()
        .then((rateLimitData) => {
            res.json(rateLimitData)
        })
        .catch(() => {
            res.status(500).json({ error: 'Failed to fetch rate limit data' })
        })
        .finally(() => {
            console.timeEnd('Fetching rate limit data')
        })
}
