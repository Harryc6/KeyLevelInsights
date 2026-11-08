import type { ReactNode } from 'react'
import { useState } from 'react'
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { useGetPeriods } from '../hooks/useGetPeriods.ts'
import { useGetMetadata } from '../hooks/useGetMetadata.ts'
import { getSeasonByPeriod } from '../utils/utils.ts'
import { lightShade, lightText } from '../utils/constants.ts'
import PeriodSelect from './PeriodSelect.tsx'
import DungeonSelect from './DungeonSelect.tsx'
import DataBoundary from './DataBoundary.tsx'

const ReportPage = ({
    title,
    filterDungeons = true,
    children,
}: {
    title: string
    filterDungeons?: boolean
    children: (period: number, dungeon: number | undefined) => ReactNode
}) => {
    const { data: periods, refetch } = useGetPeriods()
    const { data: metadata } = useGetMetadata()
    const [selection, setSelection] = useState<{ period?: number; dungeon?: number }>({})
    const period = selection.period !== undefined && periods.includes(selection.period) ? selection.period : periods[0]

    if (period === undefined) {
        return (
            <Card bg={lightShade}>
                <Stack>
                    <Title c={lightText}>{title}</Title>
                    <Text c={lightText}>
                        No collected periods yet. Reports will appear after data collection completes.
                    </Text>
                    <Button onClick={() => void refetch()} w="fit-content">
                        Refresh data
                    </Button>
                </Stack>
            </Card>
        )
    }

    const season = getSeasonByPeriod(period, metadata.seasons)
    const dungeons = season
        ? season.dungeonIds.map(
              (id) => metadata.dungeons.find((dungeon) => dungeon.id === id) ?? { id, name: `Dungeon ${id}` }
          )
        : []
    // Validate before rendering the chart so a period change cannot issue a stale dungeon query.
    const dungeon =
        filterDungeons && season?.dungeonIds.includes(selection.dungeon ?? -1) ? selection.dungeon : undefined

    return (
        <Card bg={lightShade}>
            <Stack>
                <Title c={lightText}>{title}</Title>
                <Group align="flex-end" grow>
                    <PeriodSelect
                        periods={periods}
                        seasons={metadata.seasons}
                        value={period}
                        onChange={(nextPeriod) => {
                            const nextSeason = getSeasonByPeriod(nextPeriod, metadata.seasons)
                            setSelection({
                                period: nextPeriod,
                                dungeon: nextSeason?.dungeonIds.includes(dungeon ?? -1) ? dungeon : undefined,
                            })
                        }}
                    />
                    {filterDungeons && (
                        <DungeonSelect
                            dungeons={dungeons}
                            value={dungeon}
                            onChange={(nextDungeon) => setSelection({ period, dungeon: nextDungeon })}
                        />
                    )}
                </Group>
                {!season && (
                    <Text c={lightText} size="sm">
                        No season metadata is configured for this period. Showing all-dungeon results.
                    </Text>
                )}
                <DataBoundary resetKeys={[title, period, dungeon]}>
                    {children(period, dungeon)}
                </DataBoundary>
            </Stack>
        </Card>
    )
}

export default ReportPage
