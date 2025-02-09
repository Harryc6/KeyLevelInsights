import { Link } from './link'

type Season = {
    key: Link
    id: number
}

export type MythicKeystoneSeasons = {
    _links: {
        self: Link
    }
    seasons: Season[]
    current_season: Season
}
