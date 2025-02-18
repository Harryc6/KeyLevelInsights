import { SpecId, specNames } from './map'

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

export type SpecFrequency = {
    spec: SpecId
    keystone_level: number
    runs: number
}

type keystoneLevel = {
    keystoneLevel: number
}

export type SpecFrequencyReport = keystoneLevel & {
    [key in (typeof specNames)[number]]?: number
}
