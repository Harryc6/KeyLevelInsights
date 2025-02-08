import { Guild } from './guild'
import { Character } from './character'

export type User = {
    id: number
    name: string
    guilds?: Guild[]
    characters?: Character[]
    battleTag?: string
}
