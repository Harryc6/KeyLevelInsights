import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { Select } from '@mantine/core'
import { useGetPeriods } from '../hooks/useGetPeriods.ts'

const PeriodSelect: FC<{ setActivePeriod: Dispatch<SetStateAction<string | undefined>> }> = ({ setActivePeriod }) => {
    const { data } = useGetPeriods()

    const periods = useMemo(
        () => [
            { value: '', label: 'All Periods' },
            { value: data[0].toString(), label: data[0].toString() + ' (Current)' },
            ...data.slice(1).map((value) => ({ value: value.toString(), label: value.toString() })),
        ],
        [data]
    )

    return <Select size={'xs'} data={periods} defaultValue={''} onChange={(value) => setActivePeriod(value ?? '')} />
}

export default PeriodSelect
