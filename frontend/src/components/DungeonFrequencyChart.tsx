import { FC, useMemo } from 'react'
import { useGetKeystoneFrequency } from '../hooks/useGetKeystoneFrequency.ts'
import { dungeonSeries } from '../utils/series.ts'
import { BarChart } from '@mantine/charts'

const DungeonFrequencyChart: FC = () => {
    const { data } = useGetKeystoneFrequency()
    const chartData = useMemo(
        () =>
            data.allPeriods.byDungeon.map((d) => ({
                dungeon: dungeonSeries.find((value) => Number.parseInt(value.name) === d.dungeon)?.label ?? d.dungeon,
                runs: d.byKeystoneLevel.reduce((acc, curr) => acc + curr.runs, 0),
            })),
        [data]
    )
    return (
        <BarChart
            h={500}
            w={800}
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

export default DungeonFrequencyChart
