import { FC } from 'react'
import { NavLink, Stack } from '@mantine/core'
import { IconCrop169, IconHome, IconHourglass, IconShield, IconSword } from '@tabler/icons-react'
import { useNavigate } from 'react-router'

export const Navbar: FC = () => {
    const currentUrl = window.location.pathname
    const navigate = useNavigate()
    return (
        <Stack gap={5} w={'100%'}>
            <NavLink
                onClick={() => navigate('/')}
                label={'Home'}
                active={currentUrl === '/'}
                leftSection={<IconHome size={20} stroke={1.5} />}
            />
            <NavLink
                onClick={() => navigate('/dps')}
                label={'DPS'}
                active={currentUrl.startsWith('/dps')}
                leftSection={<IconSword size={20} stroke={1.5} />}
            />
            <NavLink
                onClick={() => navigate('/healers')}
                label={'Healers'}
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
                onClick={() => navigate('/tanks')}
                label={'Tanks'}
                active={currentUrl.startsWith('/tanks')}
                leftSection={<IconShield size={20} stroke={1.5} />}
            />
            <NavLink
                onClick={() => navigate('/dungeons')}
                label={'Dungeons'}
                active={currentUrl.startsWith('/dungeons')}
                leftSection={<IconHourglass size={20} stroke={1.5} />}
            />
        </Stack>
    )
}
