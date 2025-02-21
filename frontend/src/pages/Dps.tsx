import { FC, lazy, Suspense } from 'react'
import { Skeleton, Stack, Title } from '@mantine/core'

const SpecFrequencyChart = lazy(() => import('../components/SpecFrequencyChart'))

export const Dps: FC = () => {
    return (
        <Stack>
            <Stack key={'DPS'}>
                <Title order={2}>DPS Popularity</Title>
                <Suspense fallback={<Skeleton h={595} w={740} ml={60} mb={5} />}>
                    <SpecFrequencyChart type={'DPS'} />
                </Suspense>
            </Stack>
        </Stack>
    )
}
