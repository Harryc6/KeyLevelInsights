import { bNetPathBuilder, executeBNetQuery, Region } from '../utils/bNetQuery'
import { MythicLeaderboard, MythicLeaderboardDetails } from '../types/bnet/mythicLeaderboard'

export const getMythicLeaderboardIndex = async (connectedRealmId: number): Promise<MythicLeaderboard> => {
    return executeBNetQuery<MythicLeaderboard>(
        bNetPathBuilder(`/connected-realm/${connectedRealmId}/mythic-leaderboard/index`)
    )
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.log(`Error fetching mythic leaderboard index for connected realm ${connectedRealmId}:`, error)
            throw error
        })
}

export const getMythicLeaderboardByDungeonAndPeriod = async (
    connectedRealmId: number,
    dungeonId: number,
    period: number,
    region: Region = 'eu'
): Promise<MythicLeaderboardDetails> => {
    return executeBNetQuery<MythicLeaderboardDetails>(
        bNetPathBuilder(
            `/connected-realm/${connectedRealmId}/mythic-leaderboard/${dungeonId}/period/${period}`,
            undefined,
            region
        )
    )
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error(
                `Error fetching mythic leaderboard for connected realm ${connectedRealmId}, dungeon ${dungeonId} and period ${period}:`,
                error
            )
            throw error
        })
}
