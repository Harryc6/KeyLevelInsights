import { Dispatch, FC, SetStateAction } from 'react'
import { Select } from '@mantine/core'
import { dungeonSeries } from '../utils/series.ts'

const DungeonSelect: FC<{ setActiveDungeon: Dispatch<SetStateAction<string | undefined>> }> = ({
    setActiveDungeon,
}) => {
    const data = [
        { value: '', label: 'All Dungeons' },
        ...dungeonSeries.map((dungeon) => ({ value: dungeon.name, label: dungeon.label })),
    ]

    return <Select size={'xs'} data={data} defaultValue={''} onChange={(value) => setActiveDungeon(value ?? '')} />
}

export default DungeonSelect
