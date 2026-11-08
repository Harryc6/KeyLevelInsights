import type { FC } from 'react'
import { lazy } from 'react'
import ReportPage from '../components/ReportPage.tsx'

const KeystoneFrequencyChart = lazy(() => import('../components/KeystoneFrequencyChart'))

export const Home: FC = () => (
    <ReportPage title="Key Level Popularity">
        {(period, dungeon) => <KeystoneFrequencyChart period={period} dungeon={dungeon} />}
    </ReportPage>
)
