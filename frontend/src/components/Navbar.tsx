import { FC } from 'react'
import { Button, ButtonProps } from '@mantine/core'
import { useNavigate } from 'react-router'
import { brandColor, lightText } from '../utils/constants.ts'

export const Navbar: FC<{ toggle: () => void; compact?: boolean }> = ({ toggle, compact }) => {
    const currentUrl = window.location.pathname
    const navigate = useNavigate()

    function navigateAndToggle(url: string) {
        navigate(url)
        toggle()
    }

    const activeTabStyle = { textDecoration: `underline ${brandColor} 4px` }

    const buttons = [
        { label: 'DPS', url: '/dps' },
        { label: 'Healers', url: '/healers' },
        { label: 'Tanks', url: '/tanks' },
        { label: 'Dungeons', url: '/dungeons' },
    ]

    const props: Partial<ButtonProps> = compact
        ? { size: 'compact-lg', h: 30, w: 110 }
        : { size: 'lg', h: 40, fullWidth: true }

    return (
        <>
            {buttons.map(({ label, url }) => (
                <Button
                    key={url}
                    onClick={() => navigateAndToggle(url)}
                    color={brandColor}
                    c={lightText}
                    variant={'subtle'}
                    size={'compact-lg'}
                    radius={'lg'}
                    {...props}
                    style={currentUrl === url ? activeTabStyle : {}}
                >
                    {label}
                </Button>
            ))}
        </>
    )
}
