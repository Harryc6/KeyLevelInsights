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
    const GRAPHQL_API_URL = process.env.WCL_API_URL

    return axios
        .post<GraphQLResponse<T>>(
            GRAPHQL_API_URL!,
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
            console.error('GraphQL request failed:', isAxiosError(error) ? error.message : error)
            return Promise.reject(error)
        })
}
