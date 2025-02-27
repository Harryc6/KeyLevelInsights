import { FC, lazy, Suspense, useState } from 'react'
import { Group, Skeleton, Stack, Title } from '@mantine/core'
import PeriodSelect from '../components/PeriodSelect.tsx'
import { useGetPeriods } from '../hooks/useGetPeriods.ts'

const DungeonFrequencyChart = lazy(() => import('../components/DungeonFrequencyChart'))

export const Dungeons: FC = () => {
    const { data: periods } = useGetPeriods()
    const [activePeriod, setActivePeriod] = useState<string | undefined>(periods[0].toString())

    return (
        <Stack>
            <Group justify={'space-between'}>
                <Title order={2}>Dungeon Popularity</Title>
                <PeriodSelect periods={periods} setActivePeriod={setActivePeriod} />
            </Group>
            <Suspense fallback={<Skeleton h={470} w={740} mb={30} ml={60} />}>
                <DungeonFrequencyChart
                    period={activePeriod ? Number.parseInt(activePeriod) : undefined}
                    key={`DungeonFrequency${activePeriod}`}
                />
            </Suspense>
        </Stack>
    )
}
