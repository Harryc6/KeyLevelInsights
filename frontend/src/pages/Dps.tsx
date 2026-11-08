import type { FC } from 'react'
import { lazy } from 'react'
import ReportPage from '../components/ReportPage.tsx'

const SpecFrequencyChart = lazy(() => import('../components/SpecFrequencyChart'))

export const Dps: FC = () => (
    <ReportPage title="DPS Popularity">
        {(period, dungeon) => <SpecFrequencyChart type="DPS" period={period} dungeon={dungeon} />}
    </ReportPage>
)
