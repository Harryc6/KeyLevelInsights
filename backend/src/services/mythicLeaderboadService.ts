import { bNetPathBuilder, executeBNetQuery } from '../utils/bNetQuery'
import { MythicLeaderboard, MythicLeaderboardDetails } from '../types/bnet/mythicLeaderboard'

export const getMythicLeaderboardIndex = async (connectedRealmId: number): Promise<MythicLeaderboard> => {
    return executeBNetQuery<MythicLeaderboard>(
        bNetPathBuilder(`/connected-realm/${connectedRealmId}/mythic-leaderboard/index`)
    )
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error('Error fetching rate limit data:', error)
            return Promise.reject(error)
        })
}

export const getMythicLeaderboardByDungeonAndPeriod = async (
    connectedRealmId: number,
    dungeonId: number,
    period: number
): Promise<MythicLeaderboardDetails> => {
    return executeBNetQuery<MythicLeaderboardDetails>(
        bNetPathBuilder(`/connected-realm/${connectedRealmId}/mythic-leaderboard/${dungeonId}/period/${period}`)
    )
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error('Error fetching rate limit data:', error)
            return Promise.reject(error)
        })
}
