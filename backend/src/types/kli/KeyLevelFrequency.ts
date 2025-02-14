export type KeystoneLevelFrequency = {
    keystoneLevel: number
    runs: number
}

export type DungeonFrequency = {
    byKeystoneLevel: KeystoneLevelFrequency[]
    dungeon: number
}

export type PeriodFrequencyReport = {
    byKeystoneLevel: KeystoneLevelFrequency[]
    byDungeon: DungeonFrequency[]
    totalRuns: number
}

export type FrequencyReport = {
    currentPeriod: PeriodFrequencyReport
    lastPeriod: PeriodFrequencyReport
    allPeriods: PeriodFrequencyReport
}

export type SpecFrequencyReport = {
    spec: string
    keystone_level: number
    runs: number
}
