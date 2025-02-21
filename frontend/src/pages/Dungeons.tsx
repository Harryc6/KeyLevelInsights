import { FC, lazy, Suspense } from 'react'
import { Skeleton, Stack, Title } from '@mantine/core'

const DungeonFrequencyChart = lazy(() => import('../components/DungeonFrequencyChart'))

export const Dungeons: FC = () => {
    return (
        <Stack>
            <Stack>
                <Title order={2}>Dungeon Popularity</Title>
                <Suspense fallback={<Skeleton h={470} w={840} ml={60} mb={30} />}>
                    <DungeonFrequencyChart />
                </Suspense>
            </Stack>
        </Stack>
    )
}
