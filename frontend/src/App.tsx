import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { AppShell } from './components/AppShell.tsx'
import { Home } from './pages/Home.tsx'
import { NoPage } from './pages/NoPage.tsx'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AppShell />}>
                    <Route index element={<Home />} />
                    <Route path="dps" element={<Home />} />
                    <Route path="healers" element={<Home />} />
                    <Route path="tanks" element={<Home />} />
                    <Route path="dungeons" element={<NoPage />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
