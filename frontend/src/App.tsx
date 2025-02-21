import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Home } from './pages/Home.tsx'
import { NoPage } from './pages/NoPage.tsx'
import { Dps } from './pages/Dps.tsx'
import { Tanks } from './pages/Tanks.tsx'
import { Healers } from './pages/Healers.tsx'
import { Dungeons } from './pages/Dungeons.tsx'
import { lazy } from 'react'

const AppShell = lazy(() => import('./components/AppShell'))

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<AppShell />}>
                    <Route index element={<Home />} />
                    <Route path={'dps'} element={<Dps />} />
                    <Route path={'healers'} element={<Healers />} />
                    <Route path={'tanks'} element={<Tanks />} />
                    <Route path={'dungeons'} element={<Dungeons />} />
                    <Route path={'*'} element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
