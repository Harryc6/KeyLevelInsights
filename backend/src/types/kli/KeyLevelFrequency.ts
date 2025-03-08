import { specNames } from './map'

export type KeystoneLevelFrequency = {
    keystoneLevel: number
    runs: number
}

export type DungeonFrequency = {
    dungeon: number
    runs: number
}

type keystoneLevel = {
    keystoneLevel: number
}

export type SpecFrequencyReport = keystoneLevel & {
    [key in (typeof specNames)[number]]?: number
}
