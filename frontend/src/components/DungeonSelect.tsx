import type { FC } from 'react'
import { Select } from '@mantine/core'
import type { DungeonMetadata } from '../hooks/useGetMetadata.ts'

const DungeonSelect: FC<{
    dungeons: DungeonMetadata[]
    value: number | undefined
    onChange: (dungeon: number | undefined) => void
}> = ({ dungeons, value, onChange }) => (
    <Select
        label="Dungeon"
        size="sm"
        data={[
            { value: 'all', label: 'All Dungeons' },
            ...dungeons.map(({ id, name }) => ({ value: String(id), label: name })),
        ]}
        value={value === undefined ? 'all' : String(value)}
        onChange={(dungeon) => onChange(dungeon === null || dungeon === 'all' ? undefined : Number(dungeon))}
        allowDeselect={false}
        searchable
        disabled={dungeons.length === 0}
        maxDropdownHeight={300}
        styles={{ root: { flex: '1 1 260px', minWidth: 0, maxWidth: '100%' } }}
    />
)

export default DungeonSelect
