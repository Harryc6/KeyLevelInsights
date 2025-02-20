import { IconBrightnessUp, IconMoon } from '@tabler/icons-react'
import { ActionIcon, useMantineColorScheme } from '@mantine/core'

export const ColorSchemeChanger = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()

    return (
        <ActionIcon
            size={'lg'}
            color={colorScheme === 'dark' ? 'gray' : 'dark'}
            variant={colorScheme === 'dark' ? 'subtle' : 'subtle'}
            aria-label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}
            onClick={toggleColorScheme}
        >
            {colorScheme === 'dark' ? <IconBrightnessUp /> : <IconMoon />}
        </ActionIcon>
    )
}
