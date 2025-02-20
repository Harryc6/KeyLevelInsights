import { FC, Suspense } from 'react'
import { Skeleton, Stack, Title } from '@mantine/core'
import { SpecFrequencyChart } from '../components/SpecFrequencyChart.tsx'

export const Tanks: FC = () => {
    return (
        <Stack>
            <Stack key={'Tank'}>
                <Title order={2}>Tank Frequency</Title>
                <Suspense fallback={<Skeleton h={595} w={640} ml={60} mb={5} />}>
                    <SpecFrequencyChart type={'Tank'} />
                </Suspense>
            </Stack>
        </Stack>
    )
}
