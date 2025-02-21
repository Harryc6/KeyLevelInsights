import { FC, useMemo } from 'react'
import { BarChart } from '@mantine/charts'
import { useGetKeystoneFrequency } from '../hooks/useGetKeystoneFrequency.ts'

const KeystoneFrequencyChart: FC = () => {
    const { data } = useGetKeystoneFrequency()
    const chartData = useMemo(() => data.allPeriods.byKeystoneLevel, [data])
    return (
        <BarChart
            h={500}
            w={800}
            data={chartData}
            dataKey={'keystoneLevel'}
            series={[{ name: 'runs', label: 'Total Runs', color: 'violet' }]}
            xAxisLabel={'Keystone Level'}
        />
    )
}

export default KeystoneFrequencyChart
