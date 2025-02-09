import { LocalizedString } from '../types/bnet/connectedRealm'

export const getLocalisedString = (localizedString: string | LocalizedString): string => {
    if (typeof localizedString === 'string') {
        return localizedString
    }

    return localizedString.en_GB
}
