import { FC, lazy, Suspense, useState } from 'react'
import { Card, Group, Skeleton, Stack, Title } from '@mantine/core'
import DungeonSelect from '../components/DungeonSelect'
import PeriodSelect from '../components/PeriodSelect'
import { useGetPeriods } from '../hooks/useGetPeriods.ts'
import { lightShade, lightText } from '../utils/constants.ts'

const KeystoneFrequencyChart = lazy(() => import('../components/KeystoneFrequencyChart'))

export const Home: FC = () => {
    const { data: periods } = useGetPeriods()
    const [activePeriod, setActivePeriod] = useState<string | undefined>(periods[0].toString())
    const [activeDungeon, setActiveDungeon] = useState<string | undefined>()

    return (
        <Stack>
            <Card bg={lightShade}>
                <Group justify={'space-between'} mb={'md'}>
                    <Title c={lightText}>Key Level Popularity</Title>
                    <Group>
                        <DungeonSelect setActiveDungeon={setActiveDungeon} activePeriod={activePeriod} />
                        <PeriodSelect periods={periods} setActivePeriod={setActivePeriod} />
                    </Group>
                </Group>
                <Suspense fallback={<Skeleton h={440} w={740} ml={60} mb={5} />}>
                    <KeystoneFrequencyChart
                        period={activePeriod ? Number.parseInt(activePeriod) : undefined}
                        dungeon={activeDungeon ? Number.parseInt(activeDungeon) : undefined}
                        key={`KeystoneFrequencyChart${'Period' + activePeriod}${'Dungeon' + activeDungeon}`}
                    />
                </Suspense>
            </Card>
        </Stack>
    )
}
