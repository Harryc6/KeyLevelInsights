import dotenv from 'dotenv'
import fs from 'fs'
import axios from 'axios'

// Define the expected response structure
type OAuthResponse = {
    access_token: string
    token_type: string
    expires_in: number
}

// Fetch new access token and store it
const getWCLAccessToken = async (): Promise<string> => {
    const CLIENT_ID = process.env.WCL_CLIENT_ID!
    const CLIENT_SECRET = process.env.WCL_CLIENT_SECRET!
    const TOKEN_URL = process.env.WCL_TOKEN_URL!

    return getValidAccessToken(CLIENT_ID, CLIENT_SECRET, TOKEN_URL, 'WCL')
}

const getBNetAccessToken = async (): Promise<string> => {
    const CLIENT_ID = process.env.BNET_CLIENT_ID!
    const CLIENT_SECRET = process.env.BNET_CLIENT_SECRET!
    const TOKEN_URL = process.env.BNET_TOKEN_URL!

    return getValidAccessToken(CLIENT_ID, CLIENT_SECRET, TOKEN_URL, 'BNET')
}

const getValidAccessToken = async (
    CLIENT_ID: string,
    CLIENT_SECRET: string,
    TOKEN_URL: string,
    suffix: 'WCL' | 'BNET'
): Promise<string> => {
    console.log('Fetching new access token from', TOKEN_URL)
    return axios // Fetch new access token
        .post<OAuthResponse>(TOKEN_URL, new URLSearchParams({ grant_type: 'client_credentials' }), {
            auth: { username: CLIENT_ID, password: CLIENT_SECRET },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }) // Store the token and expiry time
        .then((response) => {
            const { access_token, expires_in } = response.data
            saveAccessTokenToEnv(access_token, expires_in, suffix)
            return access_token
        })
        .catch((error) => {
            console.error('Error getting access token:', error.response?.data || error.message)
            throw new Error('Error getting access token')
        })
}

const updateEnvVariable = (key: string, value: string) => {
    const envPath = '.env'
    let envData = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''

    // Check if the key already exists in the .env file
    const regex = new RegExp(`^${key}=.*`, 'm')
    if (regex.test(envData)) {
        // Replace the existing key
        envData = envData.replace(regex, `${key}=${value}`)
    } else {
        // Append new key-value pair
        envData += `\n${key}=${value}`
    }

    fs.writeFileSync(envPath, envData.trim() + '\n') // Ensure a newline at the end
    dotenv.config() // Reload .env variables
}

const saveAccessTokenToEnv = (token: string, expiresIn: number, suffix: 'WCL' | 'BNET') => {
    const expiryTime = Date.now() + expiresIn * 1000 // Convert seconds to milliseconds

    console.log('Saving access token to .env file...')
    console.log('Token:', token)
    console.log('Expires in:', expiresIn)

    // Update the .env file with the new token and expiry time
    updateEnvVariable(suffix + '_ACCESS_TOKEN', token)
    updateEnvVariable(suffix + '_TOKEN_EXPIRY', expiryTime.toString())
}

export const getValidWCLAccessToken = async (): Promise<string> => {
    const token = process.env.WCL_ACCESS_TOKEN
    const expiryTime = parseInt(process.env.WCL_TOKEN_EXPIRY || '0')

    // Check if token is expired or missing
    if (!token || Date.now() >= expiryTime) {
        console.log('WCL token expired or missing, fetching a new one...')
        return await getWCLAccessToken() // Refresh token
    }

    return token // Use existing token
}

// Cache object to store the token and its expiry time
const tokenCache: { token: string | null; expiryTime: number } = {
    token: null,
    expiryTime: 0,
}

// Flag to prevent multiple token requests at the same time
let isFetchingToken = false
let tokenPromise: Promise<string> | null = null

export const getValidBNetAccessToken = async (): Promise<string> => {
    const currentTime = Date.now()
    const token = process.env.BNET_ACCESS_TOKEN
    const expiryTime = parseInt(process.env.BNET_TOKEN_EXPIRY || '0')

    // Check if token is cached and not expired
    if (tokenCache.token && currentTime < tokenCache.expiryTime) {
        return tokenCache.token
    }

    // Check if token is expired or missing
    if (!tokenCache.token || currentTime >= tokenCache.expiryTime) {
        if (!isFetchingToken) {
            console.info('****************************************************************')
            console.info('Battle.net Token expired or missing, fetching a new one...')
            isFetchingToken = true
            if (token && currentTime < expiryTime) {
                tokenCache.token = token
                tokenCache.expiryTime = expiryTime
                tokenPromise = Promise.resolve(token)
                console.info('Using valid token from environment variables')
                console.info('****************************************************************')
            } else {
                tokenPromise = getBNetAccessToken()
                    .then((newToken) => {
                        // Reload .env variables
                        dotenv.config()
                        // Update the cache with the new token and expiry time
                        tokenCache.token = newToken
                        tokenCache.expiryTime = parseInt(process.env.BNET_TOKEN_EXPIRY || '0')
                        return newToken
                    })
                    .catch((error) => {
                        console.error('Error getting Battle.net access token:', error)
                        throw new Error('Error getting Battle.net access token')
                    })
                    .finally(() => {
                        isFetchingToken = false
                        tokenPromise = null
                        console.info('****************************************************************')
                    })
            }
        } else {
            console.info('****************************************************************')
            console.info('Waiting for token to be fetched...')
            console.info('****************************************************************')
        }
        return tokenPromise!
    }

    return tokenCache.token // Use existing token
}
