import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import { QueryClient } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'

// Import Mantine styles
import '@mantine/core/styles.css'
import '@mantine/charts/styles.css'

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
            <MantineProvider defaultColorScheme={'auto'}>
                <App />
            </MantineProvider>
        </PersistQueryClientProvider>
    </StrictMode>
)
