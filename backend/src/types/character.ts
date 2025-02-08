import { GameFaction } from './gameFaction'
import { Guild } from './guild'
import { Server } from './server'

export type Character = {
    canonicalID: number
    claimed?: boolean
    classID: number
    faction: GameFaction
    guildRank: number
    guilds?: Guild[]
    hidden: boolean
    id: number
    level: number
    name: string
    server: Server
}
