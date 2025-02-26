import { FC } from 'react'
import { BarChart } from '@mantine/charts'
import { useGetKeystoneFrequency } from '../hooks/useGetKeystoneFrequency.ts'
import { ErrorBoundary } from 'react-error-boundary'

const KeystoneFrequencyChart: FC<{ period?: number; dungeon?: number }> = ({ period, dungeon }) => {
    const { data } = useGetKeystoneFrequency(period, dungeon)

    return (
        <ErrorBoundary fallback={<div>Failed to load keystone frequency data</div>}>
            <BarChart
                h={500}
                w={800}
                data={data}
                dataKey={'keystoneLevel'}
                series={[{ name: 'runs', label: 'Total Runs', color: 'violet' }]}
                xAxisLabel={'Keystone Level'}
            />
        </ErrorBoundary>
    )
}

export default KeystoneFrequencyChart
