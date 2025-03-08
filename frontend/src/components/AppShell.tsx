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
                    <Group justify={'flex-start'} m={'auto'}>
                        <Card bg={lightShade} h={40} p={0} pl={2} pr={'md'} w={834} visibleFrom={'sm'}>
                            <Group h={'100%'} justify={'space-between'}>
                                <Group gap={'xs'}>
                                    <img
                                        src={'/favicon-48x48.webp'}
                                        alt={'Logo'}
                                        height={38}
                                        onClick={() => navigate('/')}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <Title c={lightText}>Key Level Insights</Title>
                                </Group>
                                <Navbar toggle={toggle} compact />
                            </Group>
                        </Card>
                        <Card bg={lightShade} h={40} p={0} pl={2} pr={'md'} hiddenFrom={'sm'}>
                            <Group gap={'xs'}>
                                <img
                                    src={'/favicon-48x48.webp'}
                                    alt={'Logo'}
                                    height={38}
                                    width={38}
                                    onClick={() => navigate('/')}
                                    style={{ cursor: 'pointer' }}
                                />
                                <Title c={lightText}>Key Level Insights</Title>
                            </Group>
                        </Card>
                    </Group>
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
            <MantineAppShell.Footer withBorder={false}>
                <Group justify={'center'} align={'center'} h={60}>
                    <Title c={darkAccent} size={'xs'} ta={'center'}>
                        © {new Date().getFullYear()} Key Level Insights - This site is still under development, and all
                        data used for illustrations
                        <br />
                        is currently based only on EU server information, which may result in inaccuracies.
                    </Title>
                </Group>
            </MantineAppShell.Footer>
        </MantineAppShell>
    )
}

export default AppShell
