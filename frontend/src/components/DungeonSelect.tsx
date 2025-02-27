import { Dispatch, FC, SetStateAction } from 'react'
import { Select } from '@mantine/core'
import { DungeonSeriesByPeriod } from '../utils/utils.ts'

const DungeonSelect: FC<{
    setActiveDungeon: Dispatch<SetStateAction<string | undefined>>
    activePeriod: string | undefined
}> = ({ setActiveDungeon, activePeriod }) => {
    const data = [
        { value: '', label: 'All Dungeons' },
        ...DungeonSeriesByPeriod(activePeriod).map((dungeon) => ({
            value: dungeon.name,
            label: dungeon.label,
        })),
    ]

    return (
        <Select
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
