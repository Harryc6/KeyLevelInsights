import { Guild } from './guild'
import { GuildTag } from './guildTag'
import { Character } from './character'
import { Region } from './region'
import { Zone } from './zone'
import { User } from './user'
import { ReportArchiveStatus } from './reportArchiveStatus'
import { EncounterPhase } from './encounterPhase'

export type Report = {
    code: string
    endTime: number
    exportedSegments: number
    guild?: Guild
    guildTag?: GuildTag
    owner?: User
    rankedCharacters?: Character[]
    region?: Region
    revision: number
    segments: string
    startTime: number
    title: string
    zone?: Zone
    archiveStatus?: ReportArchiveStatus
    phase: EncounterPhase[]
}
