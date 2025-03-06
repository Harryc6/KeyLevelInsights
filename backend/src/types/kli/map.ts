export const specNames = [
    // Tanks
    'blood',
    'brewmaster',
    'guardian',
    'protectionPaladin',
    'protectionWarrior',
    'vengeance',
    // Healers
    'discipline',
    'holyPaladin',
    'holyPriest',
    'mistweaver',
    'preservation',
    'restorationDruid',
    'restorationShaman',
    // DPS
    'affliction',
    'arcane',
    'arms',
    'assassination',
    'augmentation',
    'balance',
    'beastMastery',
    'demonology',
    'destruction',
    'devastation',
    'elemental',
    'enhancement',
    'feral',
    'fire',
    `frostDeathKnight`,
    'frostMage',
    'fury',
    'havoc',
    'marksmanship',
    'outlaw',
    'retribution',
    'shadow',
    'subtlety',
    'survival',
    'unholy',
    'windwalker',
] as const

export type SpecName = (typeof specNames)[number]

export const specIds = [
    // Tanks
    250, // Blood
    268, // Brewmaster
    104, // Guardian
    66, // Protection Paladin
    73, // Protection Warrior
    581, // Vengeance
    // Healers
    256, // Discipline
    65, // Holy Paladin
    257, // Holy Priest
    270, // Mistweaver
    1468, // Preservation
    105, // Restoration Druid
    264, // Restoration Shaman
    // DPS
    265, // Affliction
    62, // Arcane
    71, // Arms
    259, // Assassination
    1473, // Augmentation
    102, // Balance
    253, // Beast Mastery
    266, // Demonology
    267, // Destruction
    1467, // Devastation
    262, // Elemental
    263, // Enhancement
    103, // Feral
    63, // Fire
    251, // Frost Death Knight
    64, // Frost Mage
    72, // Fury
    577, // Havoc
    254, // Marksmanship
    260, // Outlaw
    70, // Retribution
    258, // Shadow
    261, // Subtlety
    255, // Survival
    252, // Unholy
    269, // Windwalker
] as const

export type SpecId = (typeof specIds)[number]

export const twwDungeonS1Map = new Map<number, string>([
    [503, 'Ara Kara'],
    [501, 'Stonevault'],
    [505, 'Dawn Breaker'],
    [507, 'Grim Batol'],
    [353, 'Siege Of Boralus'],
    [502, 'City Of Threads'],
    [376, 'Necrotic Wake'],
    [375, 'Mist Of Tirna Scithe'],
])

export const twwDungeonS1IDs = Array.from(twwDungeonS1Map.keys())

export const twwDungeonS2Map = new Map<number, string>([
    [499, 'Priory'],
    [500, 'Rookery'],
    [504, 'Darkflame Cleft'],
    [506, 'Cinderbrew Meadery'],
    [525, 'Operation: Floodgate'],
    [382, 'Theater of Pain'],
    [370, 'Workshop'],
    [247, 'Motherlode'],
])

export const twwDungeonS2IDs = Array.from(twwDungeonS2Map.keys())

export const getDungeonMapByPeriod = (period: number) => (period > 1000 ? twwDungeonS2Map : twwDungeonS1Map)
export const getDungeonIDsByPeriod = (period: number) => (period > 1000 ? twwDungeonS2IDs : twwDungeonS1IDs)

export const tankSpecMap = new Map<number, string>([
    [66, 'Protection - Paladin'],
    [268, 'Brewmaster - Monk'],
    [73, 'Protection - Warrior'],
    [104, 'Guardian - Druid'],
    [250, 'Blood - Death Knight'],
    [581, 'Vengeance - Demon Hunter'],
])

export const tankIDs = Array.from(tankSpecMap.keys())

export const healerSpecMap = new Map<number, string>([
    [270, 'Mistweaver - Monk'],
    [256, 'Discipline - Priest'],
    [264, 'Restoration - Shaman'],
    [65, 'Holy - Paladin'],
    [257, 'Holy - Priest'],
    [1468, 'Preservation - Evoker'],
    [105, 'Restoration - Druid'],
])

export const healerIDs = Array.from(healerSpecMap.keys())

export const dpsSpecMap = new Map<number, string>([
    [263, 'Enhancement - Shaman'],
    [255, 'Survival - Hunter'],
    [72, 'Fury - Warrior'],
    [252, 'Unholy - Death Knight'],
    [259, 'Assassination - Rogue'],
    [64, 'Frost - Mage'],
    [62, 'Arcane - Mage'],
    [70, 'Retribution - Paladin'],
    [71, 'Arms - Warrior'],
    [253, 'Beast Mastery - Hunter'],
    [254, 'Marksmanship - Hunter'],
    [258, 'Shadow - Priest'],
    [261, 'Subtlety - Rogue'],
    [103, 'Feral - Druid'],
    [63, 'Fire - Mage'],
    [251, 'Frost - Death Knight'],
    [260, 'Outlaw - Rogue'],
    [265, 'Affliction - Warlock'],
    [266, 'Demonology - Warlock'],
    [269, 'Windwalker - Monk'],
    [102, 'Balance - Druid'],
    [577, 'Havoc - Demon Hunter'],
    [1467, 'Devastation - Evoker'],
    [1473, 'Augmentation - Evoker'],
    [262, 'Elemental - Shaman'],
    [267, 'Destruction - Warlock'],
])

export const dpsIDs = Array.from(dpsSpecMap.keys())
