import { Request, Response } from 'express'
import { getKeystoneFrequencyReport, getSpecFrequencyReport } from '../services/countKeystoneService'
import { SpecFrequency, SpecFrequencyReport } from '../types/kli/KeyLevelFrequency'
import { SpecId, specIds, SpecName, specNames } from '../types/kli/map'

export const fetchKeystoneFrequency = async (req: Request, res: Response): Promise<void> => {
    return getKeystoneFrequencyReport()
        .then((connectedRealms) => {
            res.json(connectedRealms)
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch keystone frequency report' })
            Promise.reject(error)
        })
}

export const fetchSpecFrequency = async (req: Request, res: Response): Promise<void> => {
    const period = parseInt(req.params.period)
    return getSpecFrequencyReport(period)
        .then((specFrequencies) => {
            res.json(convertToSpecFrequenciesToReports(specFrequencies))
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to fetch spec frequency report' })
            Promise.reject(error)
        })
}

const convertToSpecFrequenciesToReports = (specFrequencies: SpecFrequency[]): SpecFrequencyReport[] => {
    const specFrequencyReport: SpecFrequencyReport[] = []
    specFrequencies.forEach((specFrequency) => {
        const specName = convertSpecIdToName(specFrequency.spec)

        if (!specName) {
            console.error(`Spec ID ${specFrequency.spec} does not have a corresponding name.`)
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
