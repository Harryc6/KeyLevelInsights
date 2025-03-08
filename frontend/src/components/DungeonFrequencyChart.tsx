import { FC, useMemo } from 'react'
import { dungeonSeries } from '../utils/series.ts'
import { BarChart } from '@mantine/charts'
import { useGetDungeonFrequency } from '../hooks/useGetDungeonFrequency.tsx'

const DungeonFrequencyChart: FC<{ period: number }> = ({ period }) => {
    const { data } = useGetDungeonFrequency(period)

    const chartData = useMemo(
        () =>
            data
                .map((d) => ({
                    dungeon:
                        dungeonSeries.find((value) => Number.parseInt(value.name) === d.dungeon)?.label ?? d.dungeon,
                    runs: d.runs,
                }))
                .sort((a, b) => b.runs - a.runs),
        [data]
    )

    return (
        <BarChart
            h={500}
            w={800}
            data={chartData}
            getBarColor={(bar) => {
                const dungeon = chartData.find((value) => value.runs === bar)?.dungeon
                return dungeonSeries.find((value) => value.label === String(dungeon))?.color ?? 'violet'
            }}
            dataKey={'dungeon'}
            series={[{ name: 'runs', label: 'Total Runs', color: 'violet' }]}
            withBarValueLabel={true}
            withTooltip={false}
        />
    )
}

export default DungeonFrequencyChart
