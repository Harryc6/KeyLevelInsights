import { getValidBNetAccessToken } from './token'
import axios, { isAxiosError } from 'axios'
import { BNetPath } from '../types/bnet/link'
import Bottleneck from 'bottleneck'

type NamespaceCategory = 'static' | 'dynamic' | 'profile'
type Region = 'us' | 'eu' | 'kr' | 'tw' | 'cn'
type Namespace = `${NamespaceCategory}-${Region}`
type Locale = 'en_GB' | 'es_ES' | 'fr_FR' | 'ru_RU' | 'de_DE' | 'pt_PT' | 'it_IT'

// Create a Bottleneck limiter
const limiter = new Bottleneck({
    // reservoir: 36000, // Initial number of requests allowed
    // reservoirRefreshAmount: 36000, // Number of requests to add to the reservoir every interval
    // reservoirRefreshInterval: 1000 * 60 * 60, // Interval in milliseconds to add requests to the reservoir
    minTime: 100, // Minimum time in milliseconds between each request
})

export const executeBNetQuery = async <T>(path: BNetPath): Promise<T> => {
    const token = await getValidBNetAccessToken()
    // uncomment the following line to see the BNet query being executed
    // console.debug(`Executing BNet query: ${path}`)
    return limiter.schedule<T>(async () => {
        try {
            const response = await axios.get<T>(path, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            return response.data
        } catch (error) {
            console.error('API request failed:', isAxiosError(error) ? error.message : error)
            return await Promise.reject(error)
        }
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
