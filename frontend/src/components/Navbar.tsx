import { FC } from 'react'
import { NavLink, Stack } from '@mantine/core'
import { IconCrop169, IconHome, IconHourglass, IconShield, IconSword } from '@tabler/icons-react'

export const Navbar: FC = () => {
    const currentUrl = window.location.pathname
    return (
        <Stack gap={0} w={'100%'}>
            <NavLink
                href="/"
                label="Home"
                active={currentUrl === '/'}
                leftSection={<IconHome size={20} stroke={1.5} />}
            />
            <NavLink
                href="/dps"
                label="DPS"
                active={currentUrl.startsWith('/dps')}
                leftSection={<IconSword size={20} stroke={1.5} />}
            />
            <NavLink
                href="/healers"
                label="Healers"
                active={currentUrl.startsWith('/healers')}
                leftSection={
                    <div style={{ position: 'relative', width: 20, height: 20 }}>
                        <IconCrop169
                            size={20}
                            stroke={1.5}
                            style={{ position: 'absolute', transform: 'rotate(0deg)' }}
                        />
                        <IconCrop169
                            size={20}
                            stroke={1.5}
                            style={{ position: 'absolute', transform: 'rotate(90deg)' }}
                        />
                    </div>
                }
            />
            <NavLink
                href="/tanks"
                label="Tanks"
                active={currentUrl.startsWith('/tanks')}
                leftSection={<IconShield size={20} stroke={1.5} />}
            />
            <NavLink
                href="/dungeons"
                label="Dungeons"
                active={currentUrl.startsWith('/dungeons')}
                leftSection={<IconHourglass size={20} stroke={1.5} />}
            />
        </Stack>
    )
}
