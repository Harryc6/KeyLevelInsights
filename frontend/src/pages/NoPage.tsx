import { FC } from 'react'
import { Stack, Text, Title } from '@mantine/core'

export const NoPage: FC = () => {
    return (
        <Stack>
            <Title order={1}>404</Title>
            <Text>Page not found!</Text>
        </Stack>
    )
}
