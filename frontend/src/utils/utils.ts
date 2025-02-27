import { Series, ttwS1DungeonSeries, ttwS2DungeonSeries } from './series.ts'

export const DungeonSeriesByPeriod = (period: string | undefined): Series[] => {
    if (!period) {
        return ttwS1DungeonSeries
    }

    const activePeriod = Number.parseInt(period)
    if (activePeriod >= 976 && activePeriod <= 1000) {
        // If period is greater or equal to 976 and 1000 or less, return twwS1DungeonSeries
        return ttwS1DungeonSeries
    } else if (activePeriod >= 1001 && activePeriod <= 1025) {
        return ttwS2DungeonSeries
    } else {
        return []
    }
}
