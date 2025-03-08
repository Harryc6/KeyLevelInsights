export type DBKeystoneFrequency = {
    keystone_level: number
    period: number
    dungeon: number
    arcane: number
    fire: number
    frost_mage: number
    holy_paladin: number
    protection_paladin: number
    retribution: number
    arms: number
    fury: number
    protection_warrior: number
    balance: number
    feral: number
    guardian: number
    restoration_druid: number
    blood: number
    frost_death_knight: number
    unholy: number
    beast_mastery: number
    marksmanship: number
    survival: number
    discipline: number
    holy_priest: number
    shadow: number
    assassination: number
    outlaw: number
    subtlety: number
    elemental: number
    enhancement: number
    restoration_shaman: number
    affliction: number
    demonology: number
    destruction: number
    brewmaster: number
    windwalker: number
    mistweaver: number
    havoc: number
    vengeance: number
    devastation: number
    preservation: number
    augmentation: number
    total_runs: number
}

export type SpecFrequency = Omit<DBKeystoneFrequency, 'dungeon' | 'period' | 'total_runs'>

export type keystoneFrequency = Pick<DBKeystoneFrequency, 'keystone_level' | 'total_runs'> & {}
