import { Link } from './link'

type Dungeon = {
    key: Link
    name: string
    id: number
}

export type MythicKeystoneDungeons = {
    _links: {
        self: Link
    }
    dungeons: Dungeon[]
}
