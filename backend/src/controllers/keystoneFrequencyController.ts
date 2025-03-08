import { Request, Response } from 'express'
import {
    getDungeonFrequencyReport,
    getKeystoneFrequencyReport,
    getPeriods,
    getSpecFrequencyReport,
} from '../services/countKeystoneService'
import { SpecFrequencyReport } from '../types/kli/KeyLevelFrequency'
import { SpecDBName, specDBNames, specNames } from '../types/kli/map'
import NodeCache from 'node-cache'
import { SpecFrequency } from '../models/keystoneFrequency'

const cache = new NodeCache({ stdTTL: 3600 }) // Cache TTL of 1 hour

export const fetchKeystoneFrequency = async (req: Request, res: Response): Promise<void> => {
    const period = parseInt(req.params.period as string)
    const dungeon = parseInt(req.query.dungeon as string)
    console.time(`Fetching keystone frequency for period ${period}${dungeon ? ` and for dungeon ${dungeon}` : ''}`)
    const cacheKey = `keystoneFrequency_period_${period}_dungeon_${isNaN(dungeon) ? 'all' : dungeon}`

    // Check if the data is in the cache
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
        console.log('Returning cached data')
        res.json(cachedData)
        console.timeEnd(
            `Fetching keystone frequency for period ${period}${dungeon ? ` and for dungeon ${dungeon}` : ''}`
        )
        return
    }

    return getKeystoneFrequencyReport(period, Number.isNaN(dungeon) ? undefined : dungeon)
        .then((keystoneFrequency) => {
            cache.set(cacheKey, keystoneFrequency) // Store the result in the cache
            res.json(keystoneFrequency)
        })
        .catch(() => {
            res.status(500).json({ error: 'Failed to fetch keystone frequency report' })
        })
        .finally(() => {
            console.timeEnd(
                `Fetching keystone frequency for period ${period}${dungeon ? ` and for dungeon ${dungeon}` : ''}`
            )
        })
}

export const fetchSpecFrequency = async (req: Request, res: Response): Promise<void> => {
    const period = parseInt(req.params.period as string)
    const dungeon = parseInt(req.query.dungeon as string)
    console.time(`Fetching spec frequency for period ${period}${dungeon ? ` and for dungeon ${dungeon}` : ''}`)
    const cacheKey = `specFrequency_period_${period}_dungeon_${isNaN(dungeon) ? 'all' : dungeon}`

    // Check if the data is in the cache
    const cachedData = cache.get<SpecFrequencyReport[]>(cacheKey)
    if (cachedData) {
        console.log('Returning cached data')
        res.json(cachedData)
        console.timeEnd(`Fetching spec frequency for period ${period}${dungeon ? ` and for dungeon ${dungeon}` : ''}`)
        return
    }

    // If not in cache, fetch the data from the database
    return getSpecFrequencyReport(period, Number.isNaN(dungeon) ? undefined : dungeon)
        .then((specFrequencies) => {
            const report = convertToSpecFrequenciesToReports(specFrequencies)
            cache.set(cacheKey, report) // Store the result in the cache
            res.json(report)
        })
        .catch(() => {
            res.status(500).json({ error: 'Failed to fetch spec frequency report' })
        })
        .finally(() => {
            console.timeEnd(
                `Fetching spec frequency for period ${period}${dungeon ? ` and for dungeon ${dungeon}` : ''}`
            )
        })
}

const convertToSpecFrequenciesToReports = (specFrequencies: SpecFrequency[]): SpecFrequencyReport[] => {
    return specFrequencies.map((specFrequency) => {
        const keys = Object.keys(specFrequency).filter((key) => key !== 'keystone_level')

        return {
            keystoneLevel: specFrequency.keystone_level,
            ...Object.fromEntries(
                keys.map((key: string) => [
                    specNames[specDBNames.indexOf(key as SpecDBName)],
                    specFrequency[key as SpecDBName],
                ])
            ),
        }
    })
}

export const fetchDungeonFrequency = async (req: Request, res: Response): Promise<void> => {
    const period = parseInt(req.params.period as string)
    console.time(`Fetching dungeon frequency for period ${period}`)
    const cacheKey = `dungeonFrequency_${period}`

    // Check if the data is in the cache
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
        console.log('Returning cached data')
        res.json(cachedData)
        console.timeEnd(`Fetching dungeon frequency for period ${period}`)
        return
    }

    return getDungeonFrequencyReport(period)
        .then((dungeonFrequency) => {
            cache.set(cacheKey, dungeonFrequency) // Store the result in the cache
            res.json(dungeonFrequency)
        })
        .catch(() => {
            res.status(500).json({ error: 'Failed to fetch dungeon frequency report' })
        })
        .finally(() => {
            console.timeEnd(`Fetching dungeon frequency for period ${period}`)
        })
}

export const fetchPeriods = async (_: Request, res: Response): Promise<void> => {
    console.time('Fetching periods')
    const cacheKey = 'periods'

    // Check if the data is in the cache
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
        console.log('Returning cached data')
        res.json(cachedData)
        console.timeEnd('Fetching periods')
        return
    }

    return getPeriods()
        .then((periods) => {
            cache.set(cacheKey, periods) // Store the result in the cache
            res.json(periods)
        })
        .catch(() => {
            res.status(500).json({ error: 'Failed to fetch periods' })
        })
        .finally(() => {
            console.timeEnd('Fetching periods')
        })
}
