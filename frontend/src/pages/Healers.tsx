import { FC, Suspense } from 'react'
import { Skeleton, Stack, Title } from '@mantine/core'
import { SpecFrequencyChart } from '../components/SpecFrequencyChart.tsx'

export const Healers: FC = () => {
    return (
        <Stack>
            <Stack key={'Healer'}>
                <Title order={2}>Healer Frequency</Title>
                <Suspense fallback={<Skeleton h={595} w={640} ml={60} mb={5} />}>
                    <SpecFrequencyChart type={'Healer'} />
                </Suspense>
            </Stack>
        </Stack>
    )
}
