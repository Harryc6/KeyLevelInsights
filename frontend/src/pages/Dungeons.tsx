import type { FC } from 'react'
import { lazy } from 'react'
import ReportPage from '../components/ReportPage.tsx'

const DungeonFrequencyChart = lazy(() => import('../components/DungeonFrequencyChart'))

export const Dungeons: FC = () => (
    <ReportPage title="Dungeon Popularity" filterDungeons={false}>
        {(period) => <DungeonFrequencyChart period={period} />}
    </ReportPage>
)
