import { Dispatch, FC, SetStateAction, useMemo } from 'react'
import { Select } from '@mantine/core'

const PeriodSelect: FC<{ periods: number[]; setActivePeriod: Dispatch<SetStateAction<string | undefined>> }> = ({
    periods,
    setActivePeriod,
}) => {
    const data = useMemo(
        () => [
            { value: periods[0].toString(), label: periods[0].toString() + ' (Current)' },
            ...periods.slice(1).map((value) => ({ value: value.toString(), label: value.toString() })),
        ],
        [periods]
    )

    return (
        <Select
            size={'xs'}
            data={data}
            defaultValue={periods[0].toString()}
            onChange={(value) => setActivePeriod(value ?? '')}
            allowDeselect={false}
        />
    )
}

export default PeriodSelect
