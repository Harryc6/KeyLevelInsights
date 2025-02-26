import { FC, lazy, Suspense, useState } from 'react'
import { Group, Skeleton, Stack, Title } from '@mantine/core'
import DungeonSelect from '../components/DungeonSelect'
import PeriodSelect from '../components/PeriodSelect'

const KeystoneFrequencyChart = lazy(() => import('../components/KeystoneFrequencyChart'))

export const Home: FC = () => {
    const [activePeriod, setActivePeriod] = useState<string | undefined>()
    const [activeDungeon, setActiveDungeon] = useState<string | undefined>()

    return (
        <Stack>
            <Group justify={'space-between'}>
                <Title order={2}>Key Level Popularity</Title>
                <Group>
                    <DungeonSelect setActiveDungeon={setActiveDungeon} />
                    <PeriodSelect setActivePeriod={setActivePeriod} />
                </Group>
            </Group>
            <Suspense fallback={<Skeleton h={440} w={740} ml={60} mb={5} />}>
                <KeystoneFrequencyChart
                    period={activePeriod ? Number.parseInt(activePeriod) : undefined}
                    dungeon={activeDungeon ? Number.parseInt(activeDungeon) : undefined}
                    key={`KeystoneFrequencyChart${'Period' + activePeriod}${'Dungeon' + activeDungeon}`}
                />
            </Suspense>
        </Stack>
    )
}
