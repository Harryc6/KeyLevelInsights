import { getValidBNetAccessToken } from './token'
import axios, { isAxiosError } from 'axios'
import { BNetPath } from '../types/bnet/link'

type NamespaceCategory = 'static' | 'dynamic' | 'profile'
type Region = 'us' | 'eu' | 'kr' | 'tw' | 'cn'
type Namespace = `${NamespaceCategory}-${Region}`
type Locale = 'en_GB' | 'es_ES' | 'fr_FR' | 'ru_RU' | 'de_DE' | 'pt_PT' | 'it_IT'

export const executeBNetQuery = async <T>(path: BNetPath): Promise<T> => {
    const token = await getValidBNetAccessToken()
    console.log(`Executing BNet query: ${path}`)
    return axios
        .get<T>(path, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            return response.data
        })
        .catch((error: unknown) => {
            console.error('API request failed:', isAxiosError(error) ? error.message : error)
            return Promise.reject(error)
        })
}

export function bNetPathBuilder(
    path: string,
    params: URLSearchParams = new URLSearchParams(),
    region: Region = `eu`,
    namespace: Namespace = `dynamic-${region}`,
    locale: Locale = 'en_GB'
): BNetPath {
    const schema = 'https'
    const subdomain = region
    const domain = 'api.blizzard.com'
    const subdirectory = 'data/wow' + (path.startsWith('/') ? path : '/' + path)
    const pathParams = new URLSearchParams({ namespace, locale })
    params.forEach((value, key) => {
        pathParams.append(key, value)
    })

    // build the path
    return `${schema}://${subdomain}.${domain}/${subdirectory}?${pathParams.toString()}` as BNetPath
}
