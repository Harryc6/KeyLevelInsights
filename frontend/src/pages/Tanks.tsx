import type { FC } from 'react'
import { lazy } from 'react'
import ReportPage from '../components/ReportPage.tsx'

const SpecFrequencyChart = lazy(() => import('../components/SpecFrequencyChart'))

export const Tanks: FC = () => (
    <ReportPage title="Tank Popularity">
        {(period, dungeon) => <SpecFrequencyChart type="Tank" period={period} dungeon={dungeon} />}
    </ReportPage>
)
