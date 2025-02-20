import { FC, Suspense } from 'react'
import { BarChart } from '@mantine/charts'
import { Skeleton, Stack, Title } from '@mantine/core'
import { useGetKeystoneFrequency } from '../hooks/useGetKeystoneFrequency.ts'

export const Home: FC = () => {
    return (
        <Stack>
            <Stack>
                <Title order={2}>Key Level Popularity</Title>
                <Suspense fallback={<Skeleton h={595} w={640} ml={60} mb={5} />}>
                    <KeystoneFrequencyChart />
                </Suspense>
            </Stack>
        </Stack>
    )
}

const KeystoneFrequencyChart: FC = () => {
    const { data } = useGetKeystoneFrequency()
    const chartData = data.allPeriods.byKeystoneLevel
    return (
        <BarChart
            h={500}
            w={700}
            data={chartData}
            dataKey={'keystoneLevel'}
            series={[{ name: 'runs', label: 'Total Runs', color: 'violet' }]}
            xAxisLabel={'Keystone Level'}
        />
    )
}
