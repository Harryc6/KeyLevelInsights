import { FC } from 'react'
import { Card, Stack, Text, Title } from '@mantine/core'
import { lightText } from '../utils/constants.ts'

export const NoPage: FC = () => {
    return (
        <Card w={300} h={200}>
            <Stack align={'center'} m={'auto'}>
                <Title order={1} c={lightText}>
                    Error 404
                </Title>
                <Text c={lightText}>Page not found!</Text>
            </Stack>
        </Card>
    )
}
