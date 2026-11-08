import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { Alert, Button, Paper, Skeleton, Stack, Text } from '@mantine/core'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { lightShade, lightText } from '../utils/constants.ts'

const DataBoundary = ({ children, resetKeys }: { children: ReactNode; resetKeys: unknown[] }) => (
    <QueryErrorResetBoundary>
        {({ reset }) => (
            <ErrorBoundary
                onReset={reset}
                resetKeys={resetKeys}
                fallbackRender={({ resetErrorBoundary }) => (
                    <Alert color="red" title="Unable to load data" role="alert">
                        <Stack gap="sm">
                            <Text c={lightText}>
                                The report could not be loaded. Check the API connection and try again.
                            </Text>
                            <Button onClick={resetErrorBoundary} variant="light" color="red" w="fit-content">
                                Retry
                            </Button>
                        </Stack>
                    </Alert>
                )}
            >
                <Suspense
                    fallback={
                        <Paper bg={lightShade} p="md">
                            <Stack role="status">
                                <Text c={lightText}>Loading report data...</Text>
                                <Skeleton h={320} />
                            </Stack>
                        </Paper>
                    }
                >
                    {children}
                </Suspense>
            </ErrorBoundary>
        )}
    </QueryErrorResetBoundary>
)

export default DataBoundary
