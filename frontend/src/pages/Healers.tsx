import { FC, lazy, Suspense } from 'react'
import { Skeleton, Stack, Title } from '@mantine/core'

const SpecFrequencyChart = lazy(() => import('../components/SpecFrequencyChart'))

export const Healers: FC = () => {
    return (
        <Stack>
            <Stack key={'Healer'}>
                <Title order={2}>Healer Popularity</Title>
                <Suspense fallback={<Skeleton h={595} w={740} ml={60} mb={5} />}>
                    <SpecFrequencyChart type={'Healer'} />
                </Suspense>
            </Stack>
        </Stack>
    )
}
