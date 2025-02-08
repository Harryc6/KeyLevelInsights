import { bNetPathBuilder, executeBNetQuery } from '../utils/bNetQuery'
import { ConnectedRealm, ConnectedRealmsList, LocalizedString, PaginatedConnectedRealms } from '../types/connectedRealm'
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
                    connectedRealm.data.realms
                        .filter((value) => !value.is_tournament)
                        .map((realm) => getLocalisedString(realm.name))
                )
                .flatMap((realmNames) => realmNames)
        })
        .catch((error) => {
            console.error('Error fetching rate limit data:', error)
            return Promise.reject(error)
        })
}

export const getLocalisedString = (localizedString: string | LocalizedString): string => {
    if (typeof localizedString === 'string') {
        return localizedString
    }

    return localizedString.en_GB
}
