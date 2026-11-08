import { useSuspenseQuery } from '@tanstack/react-query'
import useFetchData from './useFetchData.ts'

export type DungeonMetadata = {
    id: number
    name: string
}

export type SeasonMetadata = {
    id: number
    name: string
    firstPeriod: number
    lastPeriod: number | null
    dungeonIds: number[]
}

export type ReportMetadata = {
    dungeons: DungeonMetadata[]
    seasons: SeasonMetadata[]
}

export const useGetMetadata = () =>
    useSuspenseQuery<ReportMetadata>({
        queryKey: ['Metadata'],
        queryFn: () => useFetchData<ReportMetadata>('/metadata'),
    })
