import { getValidBNetAccessToken } from './token'
import axios, { isAxiosError } from 'axios'
import { BNetPath } from '../types/bnet/link'
import Bottleneck from 'bottleneck'
import { setTimeout as sleep } from 'node:timers/promises'

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

export class BNetRequestError extends Error {
    constructor(
        message: string,
        readonly status: number | undefined,
        readonly path: BNetPath,
        readonly attempts: number
    ) {
        super(message)
        this.name = 'BNetRequestError'
    }
}

// Shared by collection and HTTP callers, including retries.
const limiter = new Bottleneck({
    maxConcurrent: 4,
    minTime: 100,
})
let rateLimitedUntil = 0

const retryAfterMilliseconds = (value: unknown): number => {
    if (typeof value !== 'string' && typeof value !== 'number') return 0
    const seconds = Number(value)
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000)
    const date = Date.parse(String(value))
    return Number.isFinite(date) ? Math.max(0, date - Date.now()) : 0
}

export const executeBNetQuery = async <T>(path: BNetPath): Promise<T> => {
    const maxAttempts = 3

    for (let attempt = 1; ; attempt++) {
        try {
            return await limiter.schedule<T>(async () => {
                // A 429 pauses queued requests too, not just the request that received it.
                while (Date.now() < rateLimitedUntil) {
                    await sleep(rateLimitedUntil - Date.now())
                }
                const token = await getValidBNetAccessToken()
                try {
                    const response = await axios.get<T>(path, {
                        timeout: 30000,
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    return response.data
                } catch (error) {
                    if (isAxiosError(error) && error.response?.status === 429) {
                        rateLimitedUntil = Math.max(
                            rateLimitedUntil,
                            Date.now() + Math.max(5000, retryAfterMilliseconds(error.response.headers['retry-after']))
                        )
                    }
                    throw error
                }
            })
        } catch (error) {
            if (!isAxiosError(error)) throw error

            const status = error.response?.status
            const transient = status !== undefined
                ? [429, 500, 502, 503, 504].includes(status)
                : ['ECONNABORTED', 'ETIMEDOUT', 'ECONNRESET', 'EAI_AGAIN', 'ERR_NETWORK'].includes(error.code ?? '')
            const failure = `Blizzard API GET ${path} failed with ${status === undefined ? error.code ?? 'network error' : `HTTP ${status}`} (attempt ${attempt}/${maxAttempts})`

            if (!transient || attempt === maxAttempts) {
                // Do not expose Axios config/headers: they contain the access token.
                throw new BNetRequestError(failure, status, path, attempt)
            }

            const delay = Math.max(
                1000 * 2 ** (attempt - 1) + Math.floor(Math.random() * 250),
                retryAfterMilliseconds(error.response?.headers['retry-after'])
            )
            console.warn(`${failure}; retrying in ${Math.max(delay, rateLimitedUntil - Date.now())}ms`)
            await sleep(delay)
        }
    }
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
