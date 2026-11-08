import type { FC } from 'react'
import { lazy } from 'react'
import ReportPage from '../components/ReportPage.tsx'

const SpecFrequencyChart = lazy(() => import('../components/SpecFrequencyChart'))

export const Healers: FC = () => (
    <ReportPage title="Healer Popularity">
        {(period, dungeon) => <SpecFrequencyChart type="Healer" period={period} dungeon={dungeon} />}
    </ReportPage>
)
