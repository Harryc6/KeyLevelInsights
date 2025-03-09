import { getValidBNetAccessToken } from './token'
import axios, { isAxiosError } from 'axios'
import { BNetPath } from '../types/bnet/link'
import Bottleneck from 'bottleneck'

export type NamespaceCategory = 'static' | 'dynamic' | 'profile'
export const regions = ['us', 'eu', 'kr', 'tw', 'cn'] as const
export type Region = (typeof regions)[number]
export type Namespace = `${NamespaceCategory}-${Region}`
export type Locale =
    | 'en_US' // English (US)
    | 'es_MX' // Spanish (Mexico)
    | 'pt_BR' // Portuguese (Brazil)
    | 'de_DE' // German
    | 'en_GB' // English (UK)
    | 'es_ES' // Spanish (Spain)
    | 'fr_FR' // French
    | 'it_IT' // Italian
    | 'ru_RU' // Russian
    | 'ko_KR' // Korean
    | 'zh_TW' // Traditional Chinese
    | 'zh_CN' // Simplified Chinese

// Create a Bottleneck limiter
const limiter = new Bottleneck({
    // reservoir: 36000, // Initial number of requests allowed
    // reservoirRefreshAmount: 36000, // Number of requests to add to the reservoir every interval
    // reservoirRefreshInterval: 1000 * 60 * 60, // Interval in milliseconds to add requests to the reservoir
    minTime: 10, // Minimum time in milliseconds between each request
})

export const executeBNetQuery = async <T>(path: BNetPath): Promise<T> => {
    let token = await getValidBNetAccessToken()
    const retries: number = 3
    let delay: number = 1000

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await limiter.schedule<T>(async () => {
                const response = await axios.get<T>(path, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                return response.data
            })
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 504 && attempt < retries - 1) {
                console.warn(`Attempt ${attempt + 1} failed with 504, retrying in ${delay}ms...`)
                await new Promise((resolve) => setTimeout(resolve, delay))
                delay *= 2 // Exponential backoff
                continue
            } else if (isAxiosError(error) && error.response?.status === 429 && attempt < retries - 1) {
                console.warn('Rate limited by the Blizzard API, retrying in 5 seconds...')
                await new Promise((resolve) => setTimeout(resolve, 5000))
                delay *= 2 // Exponential backoff
                continue
            } else if (isAxiosError(error) && error.response?.status === 401 && attempt < retries - 1) {
                console.warn('Access token expired, refreshing token...')
                token = await getValidBNetAccessToken()
                continue
            } else if (isAxiosError(error)) {
                console.error(`Blizzard API request failed with status code ${error.response?.status}`, path)
                throw new Error(`Blizzard API request failed with status code ${error.response?.status}`)
            }
            console.error('Blizzard API request failed:', error)
            throw new Error('Blizzard API request failed:' + error)
        }
    }
    console.error(`Failed to fetch data from ${path} after ${retries} attempts`)
    throw `Failed to fetch data from ${path} after ${retries} attempts`
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
