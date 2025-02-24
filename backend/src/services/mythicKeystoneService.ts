import { bNetPathBuilder, executeBNetQuery } from '../utils/bNetQuery'
import { MythicKeystoneSeasons } from '../types/bnet/mythicKeystoneSeason'
import { MythicKeystonePeriods } from '../types/bnet/mythicKeystonePeriod'
import { MythicKeystoneDungeons } from '../types/bnet/mythicKeystoneDungeon'

export const getMythicKeystoneDungeonsIndex = async (): Promise<MythicKeystoneDungeons> => {
    return executeBNetQuery<MythicKeystoneDungeons>(bNetPathBuilder(`/mythic-keystone/dungeon/index`))
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error('Error fetching mythic keystone dungeons:', error)
            throw error
        })
}

export const getMythicKeystonePeriodIndex = async (): Promise<MythicKeystonePeriods> => {
    return executeBNetQuery<MythicKeystonePeriods>(bNetPathBuilder(`/mythic-keystone/period/index`))
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error('Error fetching mythic keystone periods:', error)
            throw error
        })
}

export const getMythicKeystoneSeasonIndex = async (): Promise<MythicKeystoneSeasons> => {
    return executeBNetQuery<MythicKeystoneSeasons>(bNetPathBuilder(`/mythic-keystone/season/index`))
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error('Error fetching mythic keystone seasons:', error)
            throw error
        })
}

export const getCurrentPeriod = async (): Promise<number> => {
    return executeBNetQuery<MythicKeystonePeriods>(bNetPathBuilder(`/mythic-keystone/period/index`))
        .then((data) => {
            return data.current_period.id
        })
        .catch((error) => {
            console.error('Error fetching current period:', error)
            throw error
        })
}
