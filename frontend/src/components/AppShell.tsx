import { AppShell as MantineAppShell, Burger, Group, Skeleton, Stack, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FC } from 'react'
import { ColorSchemeChanger } from './ColorSchemeChanger.tsx'
import { Outlet } from 'react-router'
import { Navbar } from './Navbar.tsx'

export const AppShell: FC = () => {
    const [opened, { toggle }] = useDisclosure()

    return (
        <MantineAppShell
            header={{ height: 60 }}
            navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="sm"
        >
            <MantineAppShell.Header>
                <Group h={'100%'} justify={'flex-start'} pl={15} pr={15}>
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <img src="/favicon-256x256.webp" alt="Logo" height={40} />
                    <Title order={2}>Key Level Insights</Title>
                </Group>
            </MantineAppShell.Header>

            <MantineAppShell.Navbar p="sm">
                <Stack justify={'space-between'} h={'100%'} align={'center'}>
                    {/* nav links */}
                    <Navbar />
                    <Stack w={'100%'} gap={'sm'} align={'stretch'}>
                        {Array(15)
                            .fill(0)
                            .map((_, index) => (
                                <Skeleton key={index} height={28} radius={'l'} animate={false} />
                            ))}
                    </Stack>
                    <ColorSchemeChanger />
                </Stack>
            </MantineAppShell.Navbar>

            <MantineAppShell.Main>{<Outlet />}</MantineAppShell.Main>
        </MantineAppShell>
    )
}
