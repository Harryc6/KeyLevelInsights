import axios, { isAxiosError } from 'axios'

const RAIDER_IO_API_URL = 'https://raider.io/api/v1/'

/**
 * Executes a query against the Raider.IO API
 * @param endpoint The API endpoint to query
 * @param params The query parameters
 * @returns The response data from the query
 */
export const executeRaiderIOQuery = async <T>(
    endpoint: string,
    params: Record<string, string | number> = {}
): Promise<T> => {
    return axios
        .get<T>(`${RAIDER_IO_API_URL}${endpoint}`, { params })
        .then((response) => {
            return response.data
        })
        .catch((error: unknown) => {
            if (isAxiosError(error)) {
                console.error('Raider.IO request failed:', error.message)
            } else {
                console.error('Raider.IO request failed:', error)
            }
            return Promise.reject(error)
        })
}
