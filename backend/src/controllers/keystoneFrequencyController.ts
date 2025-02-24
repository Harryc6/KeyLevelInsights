import { Request, Response } from 'express'
import { getKeystoneFrequencyReport, getSpecFrequencyReport } from '../services/countKeystoneService'
import { SpecFrequency, SpecFrequencyReport } from '../types/kli/KeyLevelFrequency'
import { SpecId, specIds, SpecName, specNames } from '../types/kli/map'
import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 3600 }) // Cache TTL of 1 hour

export const fetchKeystoneFrequency = async (req: Request, res: Response): Promise<void> => {
    const period = parseInt(req.params.period)
    const dungeon = parseInt(req.params.dungeon)
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
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch keystone frequency report' })
            Promise.reject(error)
        })
        .finally(() => {
            console.timeEnd(
                `Fetching keystone frequency${period ? ` for period ${period}` : ''}${period && dungeon ? ' and' : ''}${dungeon ? ` for dungeon ${dungeon}` : ''}`
            )
        })
}

export const fetchSpecFrequency = async (req: Request, res: Response): Promise<void> => {
    console.time('Fetching spec frequency')
    const period = parseInt(req.params.period)
    const cacheKey = `specFrequency_${isNaN(period) ? 'all' : period}`

    // Check if the data is in the cache
    const cachedData = cache.get<SpecFrequencyReport[]>(cacheKey)
    if (cachedData) {
        console.log('Returning cached data')
        res.json(cachedData)
        console.timeEnd('Fetching spec frequency')
        return
    }

    // If not in cache, fetch the data from the database
    return getSpecFrequencyReport(Number.isNaN(period) ? undefined : period)
        .then((specFrequencies) => {
            const report = convertToSpecFrequenciesToReports(specFrequencies)
            cache.set(cacheKey, report) // Store the result in the cache
            res.json(report)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch spec frequency report' })
            Promise.reject(error)
        })
        .finally(() => {
            console.timeEnd('Fetching spec frequency')
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
