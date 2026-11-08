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
    'devourer',
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

export const specDBNames = [
    // Tanks
    'blood',
    'brewmaster',
    'guardian',
    'protection_paladin',
    'protection_warrior',
    'vengeance',
    // Healers
    'discipline',
    'holy_paladin',
    'holy_priest',
    'mistweaver',
    'preservation',
    'restoration_druid',
    'restoration_shaman',
    // DPS
    'affliction',
    'arcane',
    'arms',
    'assassination',
    'augmentation',
    'balance',
    'beast_mastery',
    'demonology',
    'destruction',
    'devastation',
    'devourer',
    'elemental',
    'enhancement',
    'feral',
    'fire',
    'frost_death_knight',
    'frost_mage',
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

export type SpecDBName = (typeof specDBNames)[number]

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
    1480, // Devourer
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
    [1480, 'Devourer - Demon Hunter'],
    [1467, 'Devastation - Evoker'],
    [1473, 'Augmentation - Evoker'],
    [262, 'Elemental - Shaman'],
    [267, 'Destruction - Warlock'],
])

export const dpsIDs = Array.from(dpsSpecMap.keys())

export const dungeons = [
    { id: 2, name: 'Temple of the Jade Serpent' },
    { id: 56, name: 'Stormstout Brewery' },
    { id: 57, name: 'Gate of the Setting Sun' },
    { id: 58, name: 'Shado-Pan Monastery' },
    { id: 59, name: 'Siege of Niuzao Temple' },
    { id: 60, name: "Mogu'shan Palace" },
    { id: 76, name: 'Scholomance' },
    { id: 77, name: 'Scarlet Halls' },
    { id: 78, name: 'Scarlet Monastery' },
    { id: 161, name: 'Skyreach' },
    { id: 163, name: 'Bloodmaul Slag Mines' },
    { id: 164, name: 'Auchindoun' },
    { id: 165, name: 'Shadowmoon Burial Grounds' },
    { id: 166, name: 'Grimrail Depot' },
    { id: 167, name: 'Upper Blackrock Spire' },
    { id: 168, name: 'The Everbloom' },
    { id: 169, name: 'Iron Docks' },
    { id: 197, name: 'Eye of Azshara' },
    { id: 198, name: 'Darkheart Thicket' },
    { id: 199, name: 'Black Rook Hold' },
    { id: 200, name: 'Halls of Valor' },
    { id: 206, name: "Neltharion's Lair" },
    { id: 207, name: 'Vault of the Wardens' },
    { id: 208, name: 'Maw of Souls' },
    { id: 209, name: 'The Arcway' },
    { id: 210, name: 'Court of Stars' },
    { id: 227, name: 'Return to Karazhan: Lower' },
    { id: 233, name: 'Cathedral of Eternal Night' },
    { id: 234, name: 'Return to Karazhan: Upper' },
    { id: 239, name: 'Seat of the Triumvirate' },
    { id: 244, name: "Atal'Dazar" },
    { id: 245, name: 'Freehold' },
    { id: 246, name: 'Tol Dagor' },
    { id: 247, name: 'The MOTHERLODE!!' },
    { id: 248, name: 'Waycrest Manor' },
    { id: 249, name: "Kings' Rest" },
    { id: 250, name: 'Temple of Sethraliss' },
    { id: 251, name: 'The Underrot' },
    { id: 252, name: 'Shrine of the Storm' },
    { id: 353, name: 'Siege of Boralus' },
    { id: 369, name: 'Operation: Mechagon - Junkyard' },
    { id: 370, name: 'Operation: Mechagon - Workshop' },
    { id: 375, name: 'Mists of Tirna Scithe' },
    { id: 376, name: 'The Necrotic Wake' },
    { id: 377, name: 'De Other Side' },
    { id: 378, name: 'Halls of Atonement' },
    { id: 379, name: 'Plaguefall' },
    { id: 380, name: 'Sanguine Depths' },
    { id: 381, name: 'Spires of Ascension' },
    { id: 382, name: 'Theater of Pain' },
    { id: 391, name: 'Tazavesh: Streets of Wonder' },
    { id: 392, name: "Tazavesh: So'leah's Gambit" },
    { id: 399, name: 'Ruby Life Pools' },
    { id: 400, name: 'The Nokhud Offensive' },
    { id: 401, name: 'The Azure Vault' },
    { id: 402, name: "Algeth'ar Academy" },
    { id: 403, name: 'Uldaman: Legacy of Tyr' },
    { id: 404, name: 'Neltharus' },
    { id: 405, name: 'Brackenhide Hollow' },
    { id: 406, name: 'Halls of Infusion' },
    { id: 438, name: 'The Vortex Pinnacle' },
    { id: 456, name: 'Throne of the Tides' },
    { id: 463, name: "Dawn of the Infinite: Galakrond's Fall" },
    { id: 464, name: "Dawn of the Infinite: Murozond's Rise" },
    { id: 499, name: 'Priory of the Sacred Flame' },
    { id: 500, name: 'The Rookery' },
    { id: 501, name: 'The Stonevault' },
    { id: 502, name: 'City of Threads' },
    { id: 503, name: 'Ara-Kara, City of Echoes' },
    { id: 504, name: 'Darkflame Cleft' },
    { id: 505, name: 'The Dawnbreaker' },
    { id: 506, name: 'Cinderbrew Meadery' },
    { id: 507, name: 'Grim Batol' },
    { id: 525, name: 'Operation: Floodgate' },
    { id: 541, name: 'The Stonecore' },
    { id: 542, name: "Eco-Dome Al'dani" },
    { id: 556, name: 'Pit of Saron' },
    { id: 557, name: 'Windrunner Spire' },
    { id: 558, name: "Magisters' Terrace" },
    { id: 559, name: 'Nexus-Point Xenas' },
    { id: 560, name: 'Maisara Caverns' },
    { id: 583, name: 'Seat of the Triumvirate' },
    { id: 584, name: 'The Blinding Vale' },
    { id: 585, name: 'Voidscar Arena' },
    { id: 586, name: 'Den of Nalorakk' },
    { id: 587, name: 'Murder Row' },
    { id: 588, name: 'Altar of Fangs' },
] as const

export type Dungeon = (typeof dungeons)[number]
export type DungeonId = Dungeon['id']
export type DungeonName = Dungeon['name']

export const getDungeonsByIDs: (ids: DungeonId[]) => Dungeon[] = (ids: DungeonId[]): Dungeon[] =>
    dungeons.filter((dungeon: Dungeon) => ids.includes(dungeon.id))

export const getDungeonById: (id: DungeonId) => Dungeon = (id: DungeonId): Dungeon => {
    const dungeon = dungeons.find((dungeon: Dungeon) => dungeon.id === id)
    if (!dungeon) throw new Error(`Dungeon with id ${id} not found`)
    return dungeon
}

export const getDungeonIDsBySeason: (seasonId: SeasonId) => DungeonId[] = (seasonId: SeasonId): DungeonId[] => {
    const ids = seasons.find((season) => season.id === seasonId)?.dungeonIds
    if (!ids) throw new Error(`No dungeon pool configured for season ${seasonId}`)
    return ids
}

export const getSeasonIDByPeriod: (period: number) => SeasonId = (period: number) => {
    const season = seasons.find((season: Season) => period >= season.firstPeriod && period <= season.lastPeriod)?.id
    if (!season) throw new Error(`No season found for period ${period}`)
    return season
}

export const getDungeonIDsByPeriod: (period: number) => DungeonId[] = (period: number): DungeonId[] =>
    getDungeonIDsBySeason(getSeasonIDByPeriod(period))

export const getDungeonsByPeriod: (period: number) => Dungeon[] = (period: number) =>
    getDungeonsByIDs(getDungeonIDsByPeriod(period))

export const twwDungeonS1IDs = [
    503, // Ara-Kara, City of Echoes
    501, // The Stonevault
    505, // The Dawnbreaker
    507, // Grim Batol
    353, // Siege of Boralus
    502, // City of Threads
    376, // The Necrotic Wake
    375, // Mists of Tirna Scithe
] satisfies readonly DungeonId[]

export const twwDungeonS2IDs = [
    499, // Priory of the Sacred Flame
    500, // The Rookery
    504, // Darkflame Cleft
    506, // Cinderbrew Meadery
    525, // Operation: Floodgate
    382, // Theater of Pain
    370, // Operation: Mechagon - Workshop
    247, // The MOTHERLODE!!
] satisfies readonly DungeonId[]

export const twwDungeonS3IDs = [
    542, // Eco-Dome Al'dani
    503, // Ara-Kara, City of Echoes
    505, // The Dawnbreaker
    525, // Operation: Floodgate
    499, // Priory of the Sacred Flame
    378, // Halls of Atonement
    391, // Tazavesh: Streets of Wonder
    392, // Tazavesh: So'leah's Gambit
] satisfies readonly DungeonId[]

export const midnightDungeonS1IDs = [
    558, // Magisters' Terrace
    560, // Maisara Caverns
    559, // Nexus-Point Xenas
    557, // Windrunner Spire
    402, // Algeth'ar Academy
    239, // Seat of the Triumvirate
    161, // Skyreach
    556, // Pit of Saron
] satisfies readonly DungeonId[]

export const midnightDungeonS2IDs = [
    588, // Altar of Fangs
    587, // Murder Row
    586, // Den of Nalorakk
    584, // The Blinding Vale
    585, // Voidscar Arena
    249, // Kings' Rest
    250, // Temple of Sethraliss
    399, // Ruby Life Pools
] satisfies readonly DungeonId[]

export const seasons = [
    { id: 13, firstPeriod: 976, lastPeriod: 1000, dungeonIds: twwDungeonS1IDs, name: 'The War Within Season 1' },
    { id: 14, firstPeriod: 1001, lastPeriod: 1022, dungeonIds: twwDungeonS2IDs, name: 'The War Within Season 2' },
    { id: 15, firstPeriod: 1023, lastPeriod: 1054, dungeonIds: twwDungeonS3IDs, name: 'The War Within Season 3' },
    { id: 17, firstPeriod: 1055, lastPeriod: 1075, dungeonIds: midnightDungeonS1IDs, name: 'Midnight Season 1' },
    { id: 18, firstPeriod: 1076, lastPeriod: Infinity, dungeonIds: midnightDungeonS2IDs, name: 'Midnight Season 2' },
] as const

export type Season = (typeof seasons)[number]
export type SeasonId = Season['id']
export type SeasonName = Season['name']
