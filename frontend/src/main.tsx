import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Card, createTheme, DEFAULT_THEME, MantineProvider, MantineTheme, Title } from '@mantine/core'
import { QueryClient } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { ErrorBoundary } from 'react-error-boundary'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { darkShade, lightText } from './utils/constants.ts'

// Import Mantine styles
import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'
// Import custom styles
import './index.css'

const theme = createTheme({
    fontFamily: `Gotham, ${DEFAULT_THEME.fontFamily}`,
    components: {
        Card: Card.extend({
            defaultProps: {
                radius: 'lg',
            },
        }),
        Title: Title.extend({
            defaultProps: {
                order: 2,
            },
        }),
    },
    breakpoints: {
        xs: '30em',
        sm: '60em',
        md: '65em',
        lg: '74em',
        xl: '90em',
    },
    primaryColor: 'brand',
    colors: {
        teal: [
            '#ebfeff',
            '#d7fbfd',
            '#aaf8fc',
            '#7df6fc',
            '#62f4fb',
            '#56f2fb',
            '#4ef2fb',
            '#41d7e0',
            '#2fbfc7',
            '#00a6ad',
        ],
        amber: [
            'oklch(0.962 0.059 95.617)',
            'oklch(0.924 0.12 95.746)',
            'oklch(0.879 0.169 91.605)',
            'oklch(0.828 0.189 84.429)',
            'oklch(0.769 0.188 70.08)',
            'oklch(0.666 0.179 58.318)',
            'oklch(0.555 0.163 48.998)',
            'oklch(0.473 0.137 46.201)',
            'oklch(0.414 0.112 45.904)',
            'oklch(0.279 0.077 45.635)',
        ],
        stone: [
            'oklch(0.97 0.001 106.424)',
            'oklch(0.923 0.003 48.717)',
            'oklch(0.869 0.005 56.366)',
            'oklch(0.709 0.01 56.259)',
            'oklch(0.553 0.013 58.071)',
            'oklch(0.444 0.011 73.639)',
            'oklch(0.374 0.01 67.558)',
            'oklch(0.268 0.007 34.298)',
            'oklch(0.216 0.006 56.043)',
            'oklch(0.147 0.004 49.25)',
        ],
        slate: [
            '#f1f5f9',
            '#e2e8f0',
            '#cbd5e1',
            '#94a3b8',
            '#64748b',
            '#475569',
            '#334155',
            '#1e293b',
            '#0f172a',
            '#020617',
        ],
        blueviolet: [
            '#f7ebff',
            '#ead1fb',
            '#d59ef9',
            '#bf68f9',
            '#ad3cf8',
            '#a124f8',
            '#9c19f9',
            '#8810de',
            '#7909c6',
            '#6800ad',
        ],
        yelloworange: [
            '#fff8e0',
            '#fff0cb',
            '#fee09b',
            '#fccf66',
            '#fbc13a',
            '#fab81d',
            '#fab308',
            '#df9d00',
            '#c68b00',
            '#ac7700',
        ],
        brand: [
            '#fef9e4',
            '#f8f1d3',
            '#eee2ab',
            '#e5d27f',
            '#ddc559',
            '#d8bc41',
            '#d6b833',
            '#bda124',
            '#a88f1b',
            '#917b0b',
        ],
    },
})

const resolver = (theme: MantineTheme) => ({
    variables: {
        '--mantine-hero-height': theme.other.heroHeight,
    },
    light: {
        '--mantine-color-body': darkShade,
        '--mantine-color-text': lightText,
    },
    dark: {},
})

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60, // One hour
            refetchOnWindowFocus: false,
        },
    },
})

const persister = createSyncStoragePersister({
    storage: window.localStorage,
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
            <MantineProvider theme={theme} forceColorScheme={'light'} cssVariablesResolver={resolver}>
                <ErrorBoundary fallback={<p>Something went wrong</p>}>
                    <App />
                    <Analytics />
                    <SpeedInsights />
                </ErrorBoundary>
            </MantineProvider>
        </PersistQueryClientProvider>
    </StrictMode>
)
