import { FC, useMemo } from 'react'
import { BarChart } from '@mantine/charts'
import { useGetKeystoneFrequency } from '../hooks/useGetKeystoneFrequency.ts'
import { ErrorBoundary } from 'react-error-boundary'

const KeystoneFrequencyChart: FC = () => {
    const { data } = useGetKeystoneFrequency()
    const chartData = useMemo(
        () =>
            data.map((d) => ({
                keystoneLevel: d.keystoneLevel !== undefined ? `${d.keystoneLevel}` : 'Unknown',
                runs: d.runs,
            })),
        [data]
    )
    return (
        <ErrorBoundary fallback={<div>Failed to load keystone frequency data</div>}>
            <BarChart
                h={500}
                w={800}
                data={chartData}
                dataKey={'keystoneLevel'}
                series={[{ name: 'runs', label: 'Total Runs', color: 'violet' }]}
                xAxisLabel={'Keystone Level'}
            />
        </ErrorBoundary>
    )
}

export default KeystoneFrequencyChart
