import type { FC } from 'react'
import { BarChart } from '@mantine/charts'
import { useGetKeystoneFrequency } from '../hooks/useGetKeystoneFrequency.ts'
import { Text } from '@mantine/core'

const KeystoneFrequencyChart: FC<{ period: number; dungeon?: number }> = ({ period, dungeon }) => {
    const { data } = useGetKeystoneFrequency(period, dungeon)

    if (data.length === 0) {
        return <Text c="dimmed">No keystone runs found for this period.</Text>
    }

    return (
        <BarChart
            h={Math.max(260, data.length * 36 + 60)}
            w="100%"
            orientation="vertical"
            data={data}
            dataKey="keystoneLevel"
            series={[{ name: 'runs', label: 'Total Runs', color: 'violet' }]}
            yAxisProps={{ reversed: true, interval: 0 }}
            xAxisProps={{ allowDecimals: false }}
            xAxisLabel="Total Runs"
            yAxisLabel="Keystone Level"
            barChartProps={{ margin: { left: 10, right: 40, bottom: 30 } }}
            withTooltip={false}
            withBarValueLabel={true}
        />
    )
}

export default KeystoneFrequencyChart
