import { useSuspenseQuery, UseSuspenseQueryResult } from '@tanstack/react-query'
import useFetchData from './useFetchData.ts'

export const useGetPeriods = (): UseSuspenseQueryResult<number[]> => {
    const path = `/periods`
    return useSuspenseQuery<number[]>({
        queryKey: ['Periods'],
        queryFn: () => useFetchData<number[]>(path),
    })
}
