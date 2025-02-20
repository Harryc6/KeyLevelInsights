import { FC, Suspense } from 'react'
import { Skeleton, Stack, Title } from '@mantine/core'
import { SpecFrequencyChart } from '../components/SpecFrequencyChart.tsx'

export const Dps: FC = () => {
    return (
        <Stack>
            <Stack key={'DPS'}>
                <Title order={2}>DPS Frequency</Title>
                <Suspense fallback={<Skeleton h={595} w={640} ml={60} mb={5} />}>
                    <SpecFrequencyChart type={'DPS'} />
                </Suspense>
            </Stack>
        </Stack>
    )
}
