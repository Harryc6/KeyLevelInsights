import { FC, Suspense } from 'react'
import { useGetSpecFrequency } from '../hooks/useGetSpecFrequency.ts'
import { BarChart, ChartSeries } from '@mantine/charts'
import { Paper, Text, Skeleton, Stack, Title, Group } from '@mantine/core'
import { useGetKeystoneFrequency } from '../hooks/useGetKeystoneFrequency.ts'
import { TooltipProps } from 'recharts'

export const Home: FC = () => {
    return (
        <Stack>
            {['Spec', 'DPS', 'Healer', 'Tank', 'Keystone', 'Dungeon'].map((title, index) => (
                <Stack key={index}>
                    <Title order={2}>{title} Frequency</Title>
                    <Suspense fallback={<Skeleton h={595} w={640} ml={60} mb={5} />}>
                        {index < 4 ? (
                            <SpecFrequencyChart type={title.toLowerCase()} />
                        ) : (
                            <FrequencyChart type={title.toLowerCase()} />
                        )}
                    </Suspense>
                </Stack>
            ))}
        </Stack>
    )
}

const FrequencyChart: FC<{ type: string }> = ({ type }) => {
    const { data } = useGetKeystoneFrequency()
    const chartData =
        type === 'keystone'
            ? data.allPeriods.byKeystoneLevel
            : data.allPeriods.byDungeon.map((d) => ({
                  dungeon: d.dungeon,
                  runs: d.byKeystoneLevel.reduce((acc, curr) => acc + curr.runs, 0),
              }))
    return (
        <BarChart
            h={500}
            w={700}
            data={chartData}
            dataKey={type === 'keystone' ? 'keystoneLevel' : 'dungeon'}
            series={[{ name: 'runs', label: 'Total Runs', color: 'violet' }]}
            xAxisLabel={type === 'keystone' ? 'Keystone Level' : 'Dungeon'}
        />
    )
}

const SpecFrequencyChart: FC<{ type: string }> = ({ type }) => {
    const { data } = useGetSpecFrequency()
    const series =
        type === 'spec'
            ? allSpecSeries
            : type === 'dps'
              ? dpsSpecSeries
              : type === 'healer'
                ? healerSpecSeries
                : tankSpecSeries
    return (
        <BarChart
            h={600}
            w={700}
            orientation="vertical"
            withXAxis={false}
            yAxisProps={{ reversed: true }}
            gridAxis="none"
            type="percent"
            data={data}
            dataKey="keystoneLevel"
            series={series}
            tooltipProps={{ content: (props) => <ChartTooltip props={props} series={series} /> }}
        />
    )
}

const ChartTooltip: FC<{ props: TooltipProps<string, string>; series: ChartSeries[] }> = ({ props, series }) => {
    if (!props.payload) return null

    const content = props.payload.map((item) => (
        <Group key={item.payload + 'group'} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Group>
                <svg height={12} width={12}>
                    <circle
                        key={item.payload + 'circle'}
                        r={6}
                        fill={item.color}
                        width={12}
                        height={12}
                        cx={6}
                        cy={6}
                    />
                </svg>
                <Text size="sm" style={{ color: 'var(--mantine-color-text)' }}>
                    {series.find((value) => value.name === item.name)?.label ?? item.name}
                </Text>
            </Group>
            <Text size="sm" style={{ color: 'var(--mantine-color-bright)' }}>
                {item.value}
            </Text>
        </Group>
    ))

    return (
        <Paper withBorder style={{ display: 'flex', flexDirection: 'column', minWidth: 200 }}>
            <Text fw={500} pt="xs" pl="md" pr="md" style={{ color: 'var(--mantine-color-bright)' }}>
                Keystone Level: {props.label}
            </Text>
            <div
                style={{
                    padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 410,
                    flexWrap: 'wrap',
                    columnGap: 'var(--mantine-spacing-md)',
                    rowGap: 'calc(var(--mantine-spacing-sm) / 2)',
                }}
            >
                {content}
            </div>
        </Paper>
    )
}

const tankSpecSeries = [
    { label: 'Blood', name: 'blood', color: '#C41E3A' },
    { label: 'Brewmaster', name: 'brewmaster', color: '#00FF98' },
    { label: 'Guardian', name: 'guardian', color: '#FF7C0A' },
    { label: 'Protection', name: 'protectionPaladin', color: '#F48CBA' },
    { label: 'Protection', name: 'protectionWarrior', color: '#C69B6D' },
    { label: 'Vengeance', name: 'vengeance', color: '#A330C9' },
]

const healerSpecSeries = [
    { label: 'Discipline', name: 'discipline', color: '#FFFFFF' },
    { label: 'Holy', name: 'holyPaladin', color: '#F48CBA' },
    { label: 'Holy', name: 'holyPriest', color: '#FFFFFF' },
    { label: 'Mistweaver', name: 'mistweaver', color: '#00FF98' },
    { label: 'Preservation', name: 'preservation', color: '#33937F' },
    { label: 'Restoration', name: 'restorationDruid', color: '#FF7C0A' },
    { label: 'Restoration', name: 'restorationShaman', color: '#0070DD' },
]

const dpsSpecSeries = [
    { label: 'Affliction', name: 'affliction', color: '#8788EE' },
    { label: 'Arcane', name: 'arcane', color: '#3FC7EB' },
    { label: 'Arms', name: 'arms', color: '#C69B6D' },
    { label: 'Assassination', name: 'assassination', color: '#FFF468' },
    { label: 'Augmentation', name: 'augmentation', color: '#33937F' },
    { label: 'Balance', name: 'balance', color: '#FF7C0A' },
    { label: 'Beast Mastery', name: 'beastMastery', color: '#AAD372' },
    { label: 'Demonology', name: 'demonology', color: '#8788EE' },
    { label: 'Destruction', name: 'destruction', color: '#8788EE' },
    { label: 'Devastation', name: 'devastation', color: '#33937F' },
    { label: 'Elemental', name: 'elemental', color: '#0070DD' },
    { label: 'Enhancement', name: 'enhancement', color: '#0070DD' },
    { label: 'Feral', name: 'feral', color: '#FF7C0A' },
    { label: 'Fire', name: 'fire', color: '#3FC7EB' },
    { label: 'Frost', name: 'frostDeathKnight', color: '#C41E3A' },
    { label: 'Frost', name: 'frostMage', color: '#3FC7EB' },
    { label: 'Fury', name: 'fury', color: '#C69B6D' },
    { label: 'Havoc', name: 'havoc', color: '#A330C9' },
    { label: 'Marksmanship', name: 'marksmanship', color: '#AAD372' },
    { label: 'Outlaw', name: 'outlaw', color: '#FFF468' },
    { label: 'Retribution', name: 'retribution', color: '#F48CBA' },
    { label: 'Shadow', name: 'shadow', color: '#FFFFFF' },
    { label: 'Subtlety', name: 'subtlety', color: '#FFF468' },
    { label: 'Survival', name: 'survival', color: '#AAD372' },
    { label: 'Unholy', name: 'unholy', color: '#C41E3A' },
    { label: 'Windwalker', name: 'windwalker', color: '#00FF98' },
]

const allSpecSeries = tankSpecSeries.concat(healerSpecSeries).concat(dpsSpecSeries)
