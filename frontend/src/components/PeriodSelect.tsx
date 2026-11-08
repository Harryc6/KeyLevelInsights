import type { FC } from 'react'
import { Select } from '@mantine/core'
import type { SeasonMetadata } from '../hooks/useGetMetadata.ts'
import { getSeasonByPeriod } from '../utils/utils.ts'

const PeriodSelect: FC<{
    periods: number[]
    seasons: SeasonMetadata[]
    value: number
    onChange: (period: number) => void
}> = ({ periods, seasons, value, onChange }) => {
    const data = periods.map((period, index) => {
        const season = getSeasonByPeriod(period, seasons)
        const label = season
            ? `${season.name} · Week ${period - season.firstPeriod + 1} · Period ${period}`
            : `Period ${period}`

        return { value: String(period), label: label + (index === 0 ? ' (Latest available)' : '') }
    })

    return (
        <Select
            label="Period"
            size="sm"
            data={data}
            value={String(value)}
            onChange={(period) => period !== null && onChange(Number(period))}
            allowDeselect={false}
            searchable
            styles={{ root: { flex: '1 1 360px', minWidth: 0, maxWidth: '100%' } }}
        />
    )
}

export default PeriodSelect
