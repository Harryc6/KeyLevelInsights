import { useSuspenseQuery, UseSuspenseQueryResult } from '@tanstack/react-query'
import useFetchData from './useFetchData.ts'

export type KeystoneLevelFrequency = {
    keystoneLevel: number
    runs: number
}

export type DungeonFrequency = {
    byKeystoneLevel: KeystoneLevelFrequency[]
    dungeon: number
}

export type PeriodFrequencyReport = {
    byKeystoneLevel: KeystoneLevelFrequency[]
    byDungeon: DungeonFrequency[]
    totalRuns: number
}

export type FrequencyReport = {
    currentPeriod: PeriodFrequencyReport
    lastPeriod: PeriodFrequencyReport
    allPeriods: PeriodFrequencyReport
}

export const useGetKeystoneFrequency = (): UseSuspenseQueryResult<FrequencyReport> => {
    return useSuspenseQuery<FrequencyReport>({
        queryKey: ['KeystoneFrequency'],
        queryFn: () => useFetchData<FrequencyReport>('keystone-frequency'),
    })
}
