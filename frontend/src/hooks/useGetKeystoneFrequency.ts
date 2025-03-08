import { useSuspenseQuery, UseSuspenseQueryResult } from '@tanstack/react-query'
import useFetchData from './useFetchData.ts'

export type KeystoneLevelFrequency = {
    keystoneLevel: number
    runs: number
}

export const useGetKeystoneFrequency = (
    period: number,
    dungeon?: number
): UseSuspenseQueryResult<KeystoneLevelFrequency[]> => {
    const path = `/keystone-frequency/${period}${dungeon ? `?dungeon=${dungeon}` : ''}`
    return useSuspenseQuery<KeystoneLevelFrequency[]>({
        queryKey: ['KeystoneFrequency', period, dungeon],
        queryFn: () => useFetchData<KeystoneLevelFrequency[]>(path),
    })
}
