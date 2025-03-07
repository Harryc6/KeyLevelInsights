import { getValidWCLAccessToken } from './token'
import axios, { isAxiosError } from 'axios'

export type GraphQLResponse<T> = { data: T }

/**
 * Executes a GraphQL query against the WCL API
 * @param query The GraphQL query to execute
 * @returns The response data from the query
 */
export const executeWCLQuery = async <T>(query: string): Promise<T> => {
    const token = await getValidWCLAccessToken()

    return axios
        .post<GraphQLResponse<T>>(
            'https://www.warcraftlogs.com/api/v2/client',
            { query },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        )
        .then((response) => {
            return response.data.data
        })
        .catch((error: unknown) => {
            if (isAxiosError(error)) {
                console.error('GraphQL request failed:', error.message)
                throw new Error(`GraphQL request failed with status code ${error.response?.status}`)
            } else {
                console.error('GraphQL request failed:', error)
                throw new Error('GraphQL request failed:' + error)
            }
        })
}
