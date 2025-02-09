import { bNetPathBuilder, executeBNetQuery } from '../utils/bNetQuery'
import { ConnectedRealm, ConnectedRealmsList, PaginatedConnectedRealms } from '../types/bnet/connectedRealm'
import { getLocalisedString } from '../utils/localisationUtils'

export const getConnectRealmsIndex = async (): Promise<ConnectedRealmsList> => {
    return executeBNetQuery<ConnectedRealmsList>(bNetPathBuilder(`/connected-realm/index`))
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error('Error fetching rate limit data:', error)
            return Promise.reject(error)
        })
}

export const getConnectedRealmByID = async (connectedRealmId: number): Promise<ConnectedRealm> => {
    return executeBNetQuery<ConnectedRealm>(bNetPathBuilder(`/connected-realm/${connectedRealmId}`))
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error('Error fetching rate limit data:', error)
            return Promise.reject(error)
        })
}

export const getConnectedRealmNames = async (): Promise<string[]> => {
    return executeBNetQuery<PaginatedConnectedRealms>(
        bNetPathBuilder(`/search/connected-realm`, new URLSearchParams({ orderby: 'id' }))
    )
        .then((paginatedConnectedRealms) => {
            return paginatedConnectedRealms.results
                .map((connectedRealm) =>
                    connectedRealm.data.realms.map((realm) => `${getLocalisedString(realm.name)} - ${realm.id}`)
                )
                .flatMap((realmNames) => realmNames)
        })
        .catch((error) => {
            console.error('Error fetching rate limit data:', error)
            return Promise.reject(error)
        })
}

export const getConnectedRealmIDs = async (): Promise<number[]> => {
    return executeBNetQuery<PaginatedConnectedRealms>(
        bNetPathBuilder(`/search/connected-realm`, new URLSearchParams({ orderby: 'id' }))
    )
        .then((paginatedConnectedRealms) => {
            return paginatedConnectedRealms.results.map((connectedRealm) => connectedRealm.data.id)
        })
        .catch((error) => {
            console.error('Error fetching rate limit data:', error)
            return Promise.reject(error)
        })
}
