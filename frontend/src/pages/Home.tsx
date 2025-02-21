import { FC, lazy, Suspense } from 'react'
import { Skeleton, Stack, Title } from '@mantine/core'

const KeystoneFrequencyChart = lazy(() => import('../components/KeystoneFrequencyChart'))

export const Home: FC = () => {
    return (
        <Stack>
            <Stack>
                <Title order={2}>Key Level Popularity</Title>
                <Suspense fallback={<Skeleton h={440} w={740} ml={60} mb={5} />}>
                    <KeystoneFrequencyChart />
                </Suspense>
            </Stack>
        </Stack>
    )
}
