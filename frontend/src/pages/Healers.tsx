import { FC, lazy, Suspense, useState } from 'react'
import { Group, Skeleton, Stack, Title } from '@mantine/core'
import PeriodSelect from '../components/PeriodSelect'
import DungeonSelect from '../components/DungeonSelect.tsx'
import { useGetPeriods } from '../hooks/useGetPeriods.ts'

const SpecFrequencyChart = lazy(() => import('../components/SpecFrequencyChart'))

export const Healers: FC = () => {
    const { data: periods } = useGetPeriods()
    const [activePeriod, setActivePeriod] = useState<string | undefined>(periods[0].toString())
    const [activeDungeon, setActiveDungeon] = useState<string | undefined>()

    return (
        <Stack>
            <Group justify={'space-between'}>
                <Title order={2}>Healer Popularity</Title>
                <Group>
                    <DungeonSelect setActiveDungeon={setActiveDungeon} activePeriod={activePeriod} />
                    <PeriodSelect periods={periods} setActivePeriod={setActivePeriod} />
                </Group>
            </Group>
            <Suspense fallback={<Skeleton h={595} w={740} ml={60} mb={5} />}>
                <SpecFrequencyChart
                    type={'Healer'}
                    period={activePeriod ? Number.parseInt(activePeriod) : undefined}
                    dungeon={activeDungeon ? Number.parseInt(activeDungeon) : undefined}
                    key={`SpecFrequencyChart${'Period' + activePeriod}${'Dungeon' + activeDungeon}`}
                />
            </Suspense>
        </Stack>
    )
}
