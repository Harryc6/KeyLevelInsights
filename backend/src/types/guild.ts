import { Server } from './server'
import { GuildAttendancePagination } from './guildAttendancePagination'
import { GameFaction } from './gameFaction'
import { GuildTag } from './guildTag'
import { CharacterPagination } from './characterPagination'
import { GuildRank } from './guildRank'

export type Guild = {
    attendance?(guildTabID: number, limit: number, page: number, zoneID: number): GuildAttendancePagination
    competitionMode: boolean
    description: string
    faction: GameFaction
    id: number
    name: string
    server: Server
    stealthMode: boolean
    tags?: GuildTag[]
    members?(limit: number, page: number): CharacterPagination
    currentUserRank?: GuildRank
}
