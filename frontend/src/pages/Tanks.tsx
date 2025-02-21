import { FC, lazy, Suspense } from 'react'
import { Skeleton, Stack, Title } from '@mantine/core'

const SpecFrequencyChart = lazy(() => import('../components/SpecFrequencyChart'))

export const Tanks: FC = () => {
    return (
        <Stack>
            <Stack key={'Tank'}>
                <Title order={2}>Tank Popularity</Title>
                <Suspense fallback={<Skeleton h={595} w={740} ml={60} mb={5} />}>
                    <SpecFrequencyChart type={'Tank'} />
                </Suspense>
            </Stack>
        </Stack>
    )
}
