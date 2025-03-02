export type Series = {
    label: string
    name: string
    color: string
}

export const tankSpecSeries: Series[] = [
    { label: 'Blood', name: 'blood', color: '#C41E3A' },
    { label: 'Brewmaster', name: 'brewmaster', color: '#00FF98' },
    { label: 'Guardian', name: 'guardian', color: '#FF7C0A' },
    { label: 'Protection', name: 'protectionPaladin', color: '#F48CBA' },
    { label: 'Protection', name: 'protectionWarrior', color: '#C69B6D' },
    { label: 'Vengeance', name: 'vengeance', color: '#A330C9' },
]

export const healerSpecSeries: Series[] = [
    { label: 'Discipline', name: 'discipline', color: '#FFFFFF' },
    { label: 'Holy', name: 'holyPaladin', color: '#F48CBA' },
    { label: 'Holy', name: 'holyPriest', color: '#FFFFFF' },
    { label: 'Mistweaver', name: 'mistweaver', color: '#00FF98' },
    { label: 'Preservation', name: 'preservation', color: '#33937F' },
    { label: 'Restoration', name: 'restorationDruid', color: '#FF7C0A' },
    { label: 'Restoration', name: 'restorationShaman', color: '#0070DD' },
]

export const dpsSpecSeries: Series[] = [
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

export const allSpecSeries: Series[] = tankSpecSeries.concat(healerSpecSeries).concat(dpsSpecSeries)

export const ttwS1DungeonSeries: Series[] = [
    { label: 'Ara-Kara, City of Echoes', name: '503', color: '#c35073' },
    { label: 'The Stonevault', name: '501', color: '#b55d31' },
    { label: 'The Dawnbreaker', name: '505', color: '#9e5ae1' },
    { label: 'Grim Batol', name: '507', color: '#995f7a' },
    { label: 'Siege of Boralus', name: '353', color: '#b5792f' },
    { label: 'City Of Threads', name: '502', color: '#6d1a2e' },
    { label: 'The Necrotic Wake', name: '376', color: '#2e6c4f' },
    { label: 'Mists of Tirna Scithe', name: '375', color: '#2b38bc' },
]

export const ttwS2DungeonSeries: Series[] = [
    { label: 'Priory', name: '499', color: '#fdf891' },
    { label: 'Rookery', name: '500', color: '#3f88e0' },
    { label: 'Darkflame Cleft', name: '504', color: '#850efd' },
    { label: 'Cinderbrew Meadery', name: '506', color: '#f06d36' },
    { label: 'Operation: Floodgate', name: '525', color: '#b52f2f' },
    { label: 'Theater of Pain', name: '382', color: '#1a6049' },
    { label: 'Workshop', name: '370', color: '#8b4106' },
    { label: 'Motherlode', name: '247', color: '#3e1ba6' },
]

export const dungeonSeries: Series[] = [...ttwS1DungeonSeries, ...ttwS2DungeonSeries]
