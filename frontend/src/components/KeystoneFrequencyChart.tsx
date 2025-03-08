import { FC } from 'react'
import { BarChart } from '@mantine/charts'
import { useGetKeystoneFrequency } from '../hooks/useGetKeystoneFrequency.ts'
import { ErrorBoundary } from 'react-error-boundary'

const KeystoneFrequencyChart: FC<{ period: number; dungeon?: number }> = ({ period, dungeon }) => {
    const { data } = useGetKeystoneFrequency(period, dungeon)

    // const exampleData = [
    //     { keystoneLevel: 2, runs: '90861' },
    //     { keystoneLevel: 3, runs: '31660' },
    //     { keystoneLevel: 4, runs: '40935' },
    //     { keystoneLevel: 5, runs: '30353' },
    //     { keystoneLevel: 6, runs: '54723' },
    //     { keystoneLevel: 7, runs: '50881' },
    //     { keystoneLevel: 8, runs: '40940' },
    //     { keystoneLevel: 9, runs: '17253' },
    //     { keystoneLevel: 10, runs: '12596' },
    //     { keystoneLevel: 11, runs: '576' },
    //     { keystoneLevel: 12, runs: '23' },
    // ]

    return (
        <ErrorBoundary fallback={<div>Failed to load keystone frequency data</div>}>
            <BarChart
                h={500}
                w={800}
                data={data}
                dataKey={'keystoneLevel'}
                series={[{ name: 'runs', label: 'Total Runs', color: 'violet' }]}
                xAxisLabel={'Keystone Level'}
                withTooltip={false}
            />
        </ErrorBoundary>
    )
}

export default KeystoneFrequencyChart
