import { AppShell as MantineAppShell, Burger, Card, Group, Stack, Title } from '@mantine/core'
import { useDisclosure, useHeadroom } from '@mantine/hooks'
import { FC, Suspense } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { Navbar } from './Navbar.tsx'
import { ErrorBoundary } from 'react-error-boundary'
import { darkAccent, lightShade, lightText } from '../utils/constants.ts'

const AppShell: FC = () => {
    const [opened, { toggle }] = useDisclosure()
    const navigate = useNavigate()
    const pinned = useHeadroom({ fixedAt: 120 })

    return (
        <MantineAppShell
            header={{ height: 60, collapsed: !pinned }}
            navbar={{ width: 200, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
            padding={'sm'}
        >
            <MantineAppShell.Header style={{ borderColor: darkAccent }}>
                <Group h={'100%'} pl={15} pr={15}>
                    <Burger opened={opened} onClick={toggle} hiddenFrom={'sm'} size={'sm'} />
                    <img
                        src={'/favicon-256x256.webp'}
                        alt={'Logo'}
                        height={40}
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    />
                    <Card
                        bg={lightShade}
                        h={40}
                        p={0}
                        pl={'md'}
                        pr={'md'}
                        pos={'fixed'}
                        style={{ justifySelf: 'anchor-center' }}
                        visibleFrom={'sm'}
                    >
                        <Group justify={'space-between'} h={'100%'} w={802}>
                            <Title c={lightText}>Key Level Insights</Title>
                            <Navbar toggle={toggle} compact />
                        </Group>
                    </Card>
                    <Card
                        bg={lightShade}
                        h={40}
                        p={0}
                        pl={'md'}
                        pr={'md'}
                        pos={'fixed'}
                        style={{ justifySelf: 'anchor-center' }}
                        hiddenFrom={'sm'}
                    >
                        <Title c={lightText}>Key Level Insights</Title>
                    </Card>
                </Group>
            </MantineAppShell.Header>

            <MantineAppShell.Navbar p={'sm'}>
                <Card bg={'#F9F7F7'} h={'100%'}>
                    <Stack justify={'flex-start'} h={'100%'} align={'center'}>
                        <Navbar toggle={toggle} />
                    </Stack>
                </Card>
            </MantineAppShell.Navbar>

            <MantineAppShell.Main>
                <ErrorBoundary fallback={<Title>Something went wrong</Title>}>
                    <Suspense fallback={<Title>Loading...</Title>}>{<Outlet />}</Suspense>
                </ErrorBoundary>
            </MantineAppShell.Main>
        </MantineAppShell>
    )
}

export default AppShell
