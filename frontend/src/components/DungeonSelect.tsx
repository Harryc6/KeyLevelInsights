import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef } from 'react'
import { Select } from '@mantine/core'
import { DungeonSeriesByPeriod } from '../utils/utils.ts'

// Custom hook to store the previous value
function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>(undefined)
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}

const DungeonSelect: FC<{
    setActiveDungeon: Dispatch<SetStateAction<string>>
    activePeriod: string
}> = ({ setActiveDungeon, activePeriod }) => {
    const data = useMemo(
        () => [
            { value: '', label: 'All Dungeons' },
            ...DungeonSeriesByPeriod(activePeriod).map((dungeon) => ({
                value: dungeon.name,
                label: dungeon.label,
            })),
        ],
        [activePeriod]
    )

    const prevData = usePrevious(data)

    useEffect(() => {
        if (JSON.stringify(prevData) !== JSON.stringify(data)) {
            setActiveDungeon('')
        }
    }, [data, prevData])

    return (
        <Select
            key={DungeonSeriesByPeriod(activePeriod)[0].name}
            size={'xs'}
            data={data}
            defaultValue={''}
            onChange={(value) => setActiveDungeon(value ?? '')}
            allowDeselect={false}
            maxDropdownHeight={240} // shows 9 items
        />
    )
}

export default DungeonSelect
