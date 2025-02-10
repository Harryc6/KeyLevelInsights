export const dungeonMap = new Map<number, string>([
    [503, 'Ara Kara'],
    [501, 'Stonevault'],
    [505, 'Dawn Breaker'],
    [507, 'Grim Batol'],
    [502, 'City Of Threads'],
    [376, 'Necrotic Wake'],
    [375, 'Mist Of Tirna Scithe'],
])

export const dungeonIDs = Array.from(dungeonMap.keys())

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
