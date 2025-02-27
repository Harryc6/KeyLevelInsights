import { Request, Response } from 'express'
import {
    getDungeonFrequencyReport,
    getKeystoneFrequencyReport,
    getPeriods,
    getSpecFrequencyReport,
} from '../services/countKeystoneService'
import { SpecFrequency, SpecFrequencyReport } from '../types/kli/KeyLevelFrequency'
import { SpecId, specIds, SpecName, specNames } from '../types/kli/map'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 3600 }) // Cache TTL of 1 hour

export const fetchKeystoneFrequency = async (req: Request, res: Response): Promise<void> => {
    const period = parseInt(req.query.period as string)
    const dungeon = parseInt(req.query.dungeon as string)
    console.time(
        `Fetching keystone frequency${period ? ` for period ${period}` : ''}${period && dungeon ? ' and' : ''}${dungeon ? ` for dungeon ${dungeon}` : ''}`
    )
    const cacheKey = `keystoneFrequency_period_${isNaN(period) ? 'all' : period}_dungeon_${isNaN(dungeon) ? 'all' : dungeon}`

    // Check if the data is in the cache
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
        console.log('Returning cached data')
        res.json(cachedData)
        console.timeEnd(
            `Fetching keystone frequency${period ? ` for period ${period}` : ''}${period && dungeon ? ' and' : ''}${dungeon ? ` for dungeon ${dungeon}` : ''}`
        )
        return
    }

    return getKeystoneFrequencyReport(
        Number.isNaN(period) ? undefined : period,
        Number.isNaN(dungeon) ? undefined : dungeon
    )
        .then((keystoneFrequency) => {
            cache.set(cacheKey, keystoneFrequency) // Store the result in the cache
            res.json(keystoneFrequency)
        })
        .catch(() => {
            res.status(500).json({ error: 'Failed to fetch keystone frequency report' })
        })
        .finally(() => {
            console.timeEnd(
                `Fetching keystone frequency${period ? ` for period ${period}` : ''}${period && dungeon ? ' and' : ''}${dungeon ? ` for dungeon ${dungeon}` : ''}`
            )
        })
}

export const fetchSpecFrequency = async (req: Request, res: Response): Promise<void> => {
    const period = parseInt(req.query.period as string)
    const dungeon = parseInt(req.query.dungeon as string)
    console.time(
        `Fetching spec frequency${period ? ` for period ${period}` : ''}${period && dungeon ? ' and' : ''}${dungeon ? ` for dungeon ${dungeon}` : ''}`
    )
    const cacheKey = `specFrequency_period_${isNaN(period) ? 'all' : period}_dungeon_${isNaN(dungeon) ? 'all' : dungeon}`

    // Check if the data is in the cache
    const cachedData = cache.get<SpecFrequencyReport[]>(cacheKey)
    if (cachedData) {
        console.log('Returning cached data')
        res.json(cachedData)
        console.timeEnd(
            `Fetching spec frequency${period ? ` for period ${period}` : ''}${period && dungeon ? ' and' : ''}${dungeon ? ` for dungeon ${dungeon}` : ''}`
        )
        return
    }

    // If not in cache, fetch the data from the database
    return getSpecFrequencyReport(
        Number.isNaN(period) ? undefined : period,
        Number.isNaN(dungeon) ? undefined : dungeon
    )
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
                `Fetching spec frequency${period ? ` for period ${period}` : ''}${period && dungeon ? ' and' : ''}${dungeon ? ` for dungeon ${dungeon}` : ''}`
            )
        })
}

const convertToSpecFrequenciesToReports = (specFrequencies: SpecFrequency[]): SpecFrequencyReport[] => {
    const specFrequencyReport: SpecFrequencyReport[] = []
    specFrequencies.forEach((specFrequency) => {
        const specName = convertSpecIdToName(specFrequency.spec_id)

        if (!specName) {
            console.error(`Spec ID ${specFrequency.spec_id} does not have a corresponding name.`)
            return
        }

        // find any existing report for this keystone level
        const existingReport = specFrequencyReport.find(
            (report) => report.keystoneLevel === specFrequency.keystone_level
        )
        if (existingReport) {
            existingReport[specName] = specFrequency.runs
            return
        }

        specFrequencyReport.push({
            keystoneLevel: specFrequency.keystone_level,
            [specName]: specFrequency.runs,
        })
    })
    return specFrequencyReport
}

const convertSpecIdToName = (specId: SpecId): SpecName => {
    return specNames[specIds.indexOf(specId)]
}

export const fetchDungeonFrequency = async (req: Request, res: Response): Promise<void> => {
    console.time('Fetching dungeon frequency')
    const period = parseInt(req.query.period as string)
    const cacheKey = `dungeonFrequency_${isNaN(period) ? 'all' : period}`

    // Check if the data is in the cache
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
        console.log('Returning cached data')
        res.json(cachedData)
        console.timeEnd('Fetching dungeon frequency')
        return
    }

    return getDungeonFrequencyReport(Number.isNaN(period) ? undefined : period)
        .then((dungeonFrequency) => {
            cache.set(cacheKey, dungeonFrequency) // Store the result in the cache
            res.json(dungeonFrequency)
        })
        .catch(() => {
            res.status(500).json({ error: 'Failed to fetch dungeon frequency report' })
        })
        .finally(() => {
            console.timeEnd('Fetching dungeon frequency')
        })
}

export const fetchPeriods = async (req: Request, res: Response): Promise<void> => {
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
