import { Region } from './region'
import { Subregion } from './subregion'
import { GuildPagination } from './guildPagination'
import { CharacterPagination } from './characterPagination'

export type Server = {
    id: number
    name: string
    normalizedName: string
    slug: string
    region: Region
    subregion: Subregion
    guilds?(limit: number, page: number): GuildPagination
    characters?(limit: number, page: number): CharacterPagination
}
