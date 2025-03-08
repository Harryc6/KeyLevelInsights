import { FC, lazy, Suspense, useState } from 'react'
import { Card, Group, Skeleton, Stack, Title } from '@mantine/core'
import PeriodSelect from '../components/PeriodSelect.tsx'
import { useGetPeriods } from '../hooks/useGetPeriods.ts'
import { lightShade, lightText } from '../utils/constants.ts'

const DungeonFrequencyChart = lazy(() => import('../components/DungeonFrequencyChart'))

export const Dungeons: FC = () => {
    const { data: periods } = useGetPeriods()
    const [activePeriod, setActivePeriod] = useState<string>(periods[0].toString())

    return (
        <Stack>
            <Card bg={lightShade}>
                <Group justify={'space-between'} mb={'md'}>
                    <Title c={lightText}>Dungeon Popularity</Title>
                    <PeriodSelect periods={periods} setActivePeriod={setActivePeriod} />
                </Group>
                <Suspense fallback={<Skeleton h={470} w={740} mb={30} ml={60} />}>
                    <DungeonFrequencyChart
                        period={Number.parseInt(activePeriod)}
                        key={`DungeonFrequency${activePeriod}`}
                    />
                </Suspense>
            </Card>
        </Stack>
    )
}
