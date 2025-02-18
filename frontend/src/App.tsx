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
                    {/*<Route path="blogs" element={<Blogs />} />*/}
                    {/*<Route path="contact" element={<Contact />} />*/}
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
