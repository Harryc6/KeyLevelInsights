import type { Request, Response } from 'express'
import type { Dungeon, Season } from '../types/kli/map'
import { dungeons, seasons } from '../types/kli/map'

export type ReportMetadata = {
    dungeons: readonly Dungeon[]
    seasons: (Omit<Season, 'lastPeriod'> & { lastPeriod: number | null })[]
}

const metadata: ReportMetadata = {
    dungeons,
    seasons: seasons.map((season) => ({
        ...season,
        lastPeriod: season.lastPeriod === Infinity ? null : season.lastPeriod,
    })),
}

export const fetchMetadata = (_: Request, res: Response<ReportMetadata>): void => {
    res.json(metadata)
}
