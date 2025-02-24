import { useSuspenseQuery, UseSuspenseQueryResult } from '@tanstack/react-query'
import useFetchData from './useFetchData.ts'

export type DungeonFrequency = {
    dungeon: number
    runs: number
}

export const useGetDungeonFrequency = (period?: number): UseSuspenseQueryResult<DungeonFrequency[]> => {
    const path = `/dungeon-frequency${period ? `?period=${period}` : ''}`
    return useSuspenseQuery<DungeonFrequency[]>({
        queryKey: ['KeystoneFrequency'],
        queryFn: () => useFetchData<DungeonFrequency[]>(path),
    })
}
