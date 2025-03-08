import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { Select } from '@mantine/core'

const PeriodSelect: FC<{ periods: number[]; setActivePeriod: Dispatch<SetStateAction<string>> }> = ({
    periods,
    setActivePeriod,
}) => {
    const getWeeksInPeriod = (period: number): string => {
        // TTW S2 started on period 1001
        if (period >= 1001) return `S2 Week ${period - 1000} - ${period}`
        // TTW S1 started on period 977
        if (period >= 977) return `S1 Week ${period - 976} - ${period}`

        return period.toString()
    }

    const data = useMemo(
        () => [
            { value: periods[0].toString(), label: getWeeksInPeriod(periods[0]) + ' (Current)' },
            ...periods.slice(1).map((value) => ({ value: value.toString(), label: getWeeksInPeriod(value) })),
        ],
        [periods]
    )

    return (
        <Select
            size={'xs'}
            data={data}
            defaultValue={periods[0].toString()}
            onChange={(value) => setActivePeriod(value ?? periods[0].toString())}
            allowDeselect={false}
        />
    )
}

export default PeriodSelect
