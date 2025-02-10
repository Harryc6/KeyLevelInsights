import { Link } from './link'

type Leaderboard = {
    key: Link
    name: string
    id: number
}

export type MythicLeaderboard = {
    _links: {
        self: Link
    }
    current_leaderboards: Leaderboard[]
}

type Realm = {
    key: Link
    id: number
    slug: string
}

type Profile = {
    name: string
    id: number
    realm: Realm
}

type Faction = {
    type: string
}

type Specialization = {
    key: Link
    id: number
}

export type Member = {
    profile: Profile
    faction: Faction
    specialization: Specialization
}

type Color = {
    r: number
    g: number
    b: number
    a: number
}

type MythicRating = {
    color: Color
    rating: number
}

export type LeadingGroup = {
    ranking: number
    duration: number
    completed_timestamp: number
    keystone_level: number
    members: Member[]
    mythic_rating: MythicRating
}

type KeystoneAffix = {
    keystone_affix: {
        key: Link
        name: string
        id: number
    }
    starting_level: number
}

type Map = {
    name: string
    id: number
}

export type MythicLeaderboardDetails = {
    _links: {
        self: Link
    }
    map: Map
    period: number
    period_start_timestamp: number
    period_end_timestamp: number
    connected_realm: Link
    leading_groups: LeadingGroup[]
    keystone_affixes: KeystoneAffix[]
    map_challenge_mode_id: number
    name: string
}
