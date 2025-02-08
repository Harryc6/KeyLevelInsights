import { RateLimit } from '../models/rateLimit'
import { executeWCLQuery } from '../utils/wclQuery'
import { RateLimitData } from '../types/rateLimitData'

const rateLimitQuery = `
    {
        rateLimitData {
            limitPerHour
            pointsSpentThisHour
            pointsResetIn
        }
    }
`

export const getRateLimitData = async (): Promise<RateLimitData> => {
    return executeWCLQuery<RateLimit>(rateLimitQuery)
        .then((data) => {
            return data.rateLimitData
        })
        .catch((error) => {
            console.error('Error fetching rate limit data:', error)
            return Promise.reject(error)
        })
}
