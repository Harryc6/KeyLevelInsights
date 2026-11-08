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
    const path = bNetPathBuilder(
        `/connected-realm/${connectedRealmId}/mythic-leaderboard/${dungeonId}/period/${period}`,
        undefined,
        region
    )
    const data = await executeBNetQuery<MythicLeaderboardDetails>(path)
    const realmPath = `https://${region}.api.blizzard.com/data/wow/connected-realm/${connectedRealmId}`
    if (
        !data ||
        data.period !== period ||
        data.map_challenge_mode_id !== dungeonId ||
        typeof data.connected_realm?.href !== 'string' ||
        data.connected_realm.href.split('?')[0] !== realmPath
    ) {
        throw new Error(`Invalid Blizzard leaderboard response for ${path}: missing or mismatched dungeon/period/realm metadata`)
    }
    // Normalize an omitted upstream collection; callers always receive an array.
    if (data.leading_groups === undefined) {
        data.leading_groups = []
    } else if (!Array.isArray(data.leading_groups)) {
        throw new Error(`Invalid Blizzard leaderboard response for ${path}: leading_groups must be an array when present`)
    }
    return data
}
