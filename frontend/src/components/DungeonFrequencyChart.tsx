import type { FC } from 'react'
import { useMemo } from 'react'
import { Text, useMatches } from '@mantine/core'
import { Text as ChartText } from 'recharts'
import { BarChart } from '@mantine/charts'
import { useGetDungeonFrequency } from '../hooks/useGetDungeonFrequency.tsx'
import { useGetMetadata } from '../hooks/useGetMetadata.ts'

const DungeonFrequencyChart: FC<{ period: number }> = ({ period }) => {
    const { data } = useGetDungeonFrequency(period)
    const { data: metadata } = useGetMetadata()
    const labelWidth = useMatches({ base: 150, sm: 260 })

    const chartData = useMemo(
        () =>
            data
                .map((d) => ({
                    dungeon: metadata.dungeons.find((value) => value.id === d.dungeon)?.name ?? `Dungeon ${d.dungeon}`,
                    runs: d.runs,
                }))
                .sort((a, b) => b.runs - a.runs),
        [data, metadata.dungeons]
    )

    if (chartData.length === 0) {
        return <Text c="dimmed">No dungeon runs found for this period.</Text>
    }

    const rowHeight = Math.max(
        44,
        ...chartData.map((row) => Math.ceil((row.dungeon.length * 7) / (labelWidth - 20)) * 16 + 12)
    )

    return (
        <BarChart
            h={chartData.length * rowHeight + 60}
            w="100%"
            orientation="vertical"
            data={chartData}
            yAxisProps={{
                width: labelWidth,
                interval: 0,
                tick: ({ x = 0, y = 0, payload }: { x?: number; y?: number; payload?: { value: string } }) => (
                    <ChartText
                        x={x - 10}
                        y={y}
                        width={labelWidth - 20}
                        textAnchor="end"
                        verticalAnchor="middle"
                        fontSize={12}
                        fill="currentColor"
                    >
                        {payload?.value}
                    </ChartText>
                ),
            }}
            xAxisProps={{ allowDecimals: false }}
            xAxisLabel="Total Runs"
            barChartProps={{ margin: { right: 40, bottom: 30 } }}
            dataKey={'dungeon'}
            series={[{ name: 'runs', label: 'Total Runs', color: 'violet' }]}
            withBarValueLabel={true}
            withTooltip={false}
        />
    )
}

export default DungeonFrequencyChart
