import type { SeasonMetadata } from '../hooks/useGetMetadata.ts'

export const getSeasonByPeriod = (period: number, seasons: SeasonMetadata[]): SeasonMetadata | undefined =>
    seasons.find(
        ({ firstPeriod, lastPeriod }) => period >= firstPeriod && (lastPeriod === null || period <= lastPeriod)
    )

export function formatNumber(num: number, decimals: number = 0): string {
    // Handle edge cases
    if (num === 0) return '0'
    if (isNaN(num) || !isFinite(num)) return 'Invalid'

    const isNegative = num < 0
    const absNum = Math.abs(num)

    // Define thresholds and suffixes
    const suffixes = [
        { threshold: 1e9, suffix: 'B' }, // Billions
        { threshold: 1e6, suffix: 'M' }, // Millions
        { threshold: 1e3, suffix: 'K' }, // Thousands
        { threshold: 1, suffix: '' }, // Base
    ]

    // Find appropriate suffix
    const { threshold, suffix } = suffixes.find((s) => absNum >= s.threshold)!

    // Scale and format
    const scaled = absNum / threshold
    const formatted = scaled.toFixed(decimals)

    return `${isNegative ? '-' : ''}${formatted}${suffix}`
}
