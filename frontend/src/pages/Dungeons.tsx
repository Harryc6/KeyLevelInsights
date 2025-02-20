import { FC, Suspense } from 'react'
import { Skeleton, Stack, Title } from '@mantine/core'
import { useGetKeystoneFrequency } from '../hooks/useGetKeystoneFrequency.ts'
import { BarChart } from '@mantine/charts'
import { dungeonSeries } from '../utils/series.ts'

export const Dungeons: FC = () => {
    return (
        <Stack>
            <Stack>
                <Title order={2}>Dungeon Popularity</Title>
                <Suspense fallback={<Skeleton h={595} w={640} ml={60} mb={5} />}>
                    <DungeonFrequencyChart />
                </Suspense>
            </Stack>
        </Stack>
    )
}

const DungeonFrequencyChart: FC = () => {
    const { data } = useGetKeystoneFrequency()
    const chartData = data.allPeriods.byDungeon.map((d) => ({
        dungeon: dungeonSeries.find((value) => Number.parseInt(value.name) === d.dungeon)?.label ?? d.dungeon,
        runs: d.byKeystoneLevel.reduce((acc, curr) => acc + curr.runs, 0),
    }))
    return (
        <BarChart
            h={500}
            w={700}
            data={chartData}
            getBarColor={(bar) => {
                const dungeon = chartData.find((value) => value.runs === bar)?.dungeon
                return dungeonSeries.find((value) => value.label === dungeon)?.color ?? 'violet'
            }}
            dataKey={'dungeon'}
            series={[{ name: 'runs', label: 'Total Runs', color: 'violet' }]}
            withBarValueLabel={true}
            withTooltip={false}
            withYAxis={false}
        />
    )
}
