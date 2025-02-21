import { FC } from 'react'
import { useGetSpecFrequency } from '../hooks/useGetSpecFrequency.ts'
import { BarChart, ChartSeries } from '@mantine/charts'
import { TooltipProps } from 'recharts'
import { Group, Paper, Text } from '@mantine/core'
import { allSpecSeries, dpsSpecSeries, healerSpecSeries, tankSpecSeries } from '../utils/series.ts'

export type DisplayType = 'Spec' | 'DPS' | 'Healer' | 'Tank'

const SpecFrequencyChart: FC<{ type: DisplayType }> = ({ type }) => {
    const { data } = useGetSpecFrequency()
    const series =
        type === 'Spec'
            ? allSpecSeries
            : type === 'DPS'
              ? dpsSpecSeries
              : type === 'Healer'
                ? healerSpecSeries
                : tankSpecSeries
    return (
        <BarChart
            h={600}
            w={800}
            orientation={'vertical'}
            withXAxis={false}
            yAxisProps={{ reversed: true }}
            gridAxis={'none'}
            type={'percent'}
            data={data}
            dataKey={'keystoneLevel'}
            series={series}
            tooltipProps={{ content: (props) => <ChartTooltip props={props} series={series} /> }}
        />
    )
}

export default SpecFrequencyChart

export const ChartTooltip: FC<{ props: TooltipProps<string, string>; series: ChartSeries[] }> = ({ props, series }) => {
    if (!props.payload) return null

    const content = props.payload.map((item) => (
        <Group key={item.payload + 'group'} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Group>
                <svg height={12} width={12}>
                    <circle
                        key={item.payload + 'circle'}
                        r={6}
                        fill={item.color}
                        width={12}
                        height={12}
                        cx={6}
                        cy={6}
                    />
                </svg>
                <Text size={'sm'} style={{ color: 'var(--mantine-color-text)' }}>
                    {series.find((value) => value.name === item.name)?.label ?? item.name}
                </Text>
            </Group>
            <Text size={'sm'} style={{ color: 'var(--mantine-color-bright)' }}>
                {item.value}
            </Text>
        </Group>
    ))

    return (
        <Paper withBorder style={{ display: 'flex', flexDirection: 'column', minWidth: 200 }}>
            <Text fw={500} pt={'xs'} pl={'md'} pr={'md'} style={{ color: 'var(--mantine-color-bright)' }}>
                Keystone Level: {props.label}
            </Text>
            <div
                style={{
                    padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 390,
                    flexWrap: 'wrap',
                    columnGap: 'var(--mantine-spacing-md)',
                    rowGap: 'calc(var(--mantine-spacing-sm) / 2)',
                }}
            >
                {content}
            </div>
        </Paper>
    )
}
