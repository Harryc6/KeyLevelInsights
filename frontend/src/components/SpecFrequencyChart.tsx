import type { FC } from 'react'
import type { SpecFrequencyReport } from '../hooks/useGetSpecFrequency.ts'
import { useGetSpecFrequency } from '../hooks/useGetSpecFrequency.ts'
import { BarChartSeries } from '@mantine/charts'
import { BarChart } from '@mantine/charts'
import { Divider, Group, Paper, SimpleGrid, Text } from '@mantine/core'
import { allSpecSeries, dpsSpecSeries, healerSpecSeries, tankSpecSeries } from '../utils/series.ts'
import { lightShade } from '../utils/constants.ts'
import { TooltipPayload } from 'recharts'
import { formatNumber } from '../utils/utils.ts'

export type DisplayType = 'Spec' | 'DPS' | 'Healer' | 'Tank'

const SpecFrequencyChart: FC<{ type: DisplayType; period: number; dungeon?: number }> = ({ type, period, dungeon }) => {
    const { data } = useGetSpecFrequency(period, dungeon)
    const series =
        type === 'Spec'
            ? allSpecSeries
            : type === 'DPS'
              ? dpsSpecSeries
              : type === 'Healer'
                ? healerSpecSeries
                : tankSpecSeries

    if (data.length === 0) {
        return <Text c="dimmed">No specialization runs found for this period.</Text>
    }

    if (!data.some((row) => series.some((item) => row[item.name as keyof SpecFrequencyReport] > 0))) {
        return <Text c="dimmed">No runs found for the selected role in this period.</Text>
    }

    return (
        <BarChart
            h={Math.max(300, data.length * 36 + 60)}
            w="100%"
            orientation={'vertical'}
            withXAxis={false}
            yAxisProps={{ reversed: true, interval: 0 }}
            gridAxis={'x'}
            type={'percent'}
            data={data}
            dataKey={'keystoneLevel'}
            series={series}

            tooltipAnimationDuration={200}
            tooltipProps={{ content: ({ label, payload }) => <ChartTooltip label={label} payload={payload} series={series} /> }}
        />
    )
}

export default SpecFrequencyChart

type ChartTooltipProps = {
    label: string | number | undefined,
    payload: TooltipPayload,
    series: BarChartSeries[]
}

export const ChartTooltip: FC<ChartTooltipProps> = ({ label, payload, series }) => {
    if (!payload) return null

    const totalValue = payload.reduce((accumulator, value) => accumulator + (value.value as number ?? 0), 0)

    const availableContent = payload.filter((item) => item.value)
    const contentLength = availableContent.length
    const numberOfColumns = Math.ceil(contentLength / 9)

    const content = availableContent.map((item, index) => {
        const name = String(item.dataKey ?? item.name)
        const label = series.find((value) => value.name === item.name)?.label ?? item.name
        const className = name.match(/(DeathKnight|Mage|Paladin|Warrior|Priest|Druid|Shaman)$/)?.[0]
        const percentage = ` | ${(((item.value as number) / totalValue) * 100).toFixed(2)}%`
        const shortValue = formatNumber(Number(item.value))
        const rowIndex = Math.floor(index / numberOfColumns)
        const isEvenRow = rowIndex % 2 === 0

        return (
            <div>
                <Group
                    key={name}
                    justify="space-between"
                    wrap="nowrap"
                    py={2}
                    px={8}
                    bg={isEvenRow ? 'gray.2' : 'transparent'}
                >
                    <Group gap="xs" wrap="nowrap">
                        <svg height={12} width={12}>
                            <circle r={6} fill={item.color} cx={6} cy={6} />
                        </svg>
                        <Text size="sm" c="text">
                            {label}
                            {className ? ` (${className.replace('DeathKnight', 'DK')})` : ''}
                        </Text>
                    </Group>
                    <Text size="sm" c="bright">
                        {shortValue}
                        {percentage}
                    </Text>
                </Group>
                <Divider />
            </div>
        )
    })

    return (
        <Paper
            withBorder
            shadow={'xl'}
            style={{ minWidth: 250, maxWidth: 'calc(100vw - 32px)', background: lightShade, height: '100%' }}
        >
            <Text fw={500} pt={'xs'} pl={'md'} pr={'md'} style={{ color: 'var(--mantine-color-bright)' }}>
                Keystone Level: {payload[0]?.payload?.keystoneLevel ?? label}
            </Text>
            <SimpleGrid cols={numberOfColumns} spacing={0}>
                {content}
            </SimpleGrid>
        </Paper>
    )
}
