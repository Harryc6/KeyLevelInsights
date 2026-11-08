import { BarChartSeries } from '@mantine/charts'


export const tankSpecSeries: BarChartSeries[] = [
    { label: 'Blood', name: 'blood', color: '#C41E3A' },
    { label: 'Brewmaster', name: 'brewmaster', color: '#00FF98' },
    { label: 'Guardian', name: 'guardian', color: '#FF7C0A' },
    { label: 'Protection', name: 'protectionPaladin', color: '#F48CBA' },
    { label: 'Protection', name: 'protectionWarrior', color: '#C69B6D' },
    { label: 'Vengeance', name: 'vengeance', color: '#A330C9' },
]

export const healerSpecSeries: BarChartSeries[] = [
    { label: 'Discipline', name: 'discipline', color: '#FFFFFF' },
    { label: 'Holy', name: 'holyPaladin', color: '#F48CBA' },
    { label: 'Holy', name: 'holyPriest', color: '#FFFFFF' },
    { label: 'Mistweaver', name: 'mistweaver', color: '#00FF98' },
    { label: 'Preservation', name: 'preservation', color: '#33937F' },
    { label: 'Restoration', name: 'restorationDruid', color: '#FF7C0A' },
    { label: 'Restoration', name: 'restorationShaman', color: '#0070DD' },
]

export const dpsSpecSeries: BarChartSeries[] = [
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
    { label: 'Devourer', name: 'devourer', color: '#A330C9' },
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

export const allSpecSeries: BarChartSeries[] = tankSpecSeries.concat(healerSpecSeries).concat(dpsSpecSeries)
