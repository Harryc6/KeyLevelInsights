import { Link } from './link'

export type LocalizedString = {
    it_IT: string
    ru_RU: string
    en_GB: string
    zh_TW: string
    ko_KR: string
    en_US: string
    es_MX: string
    pt_BR: string
    es_ES: string
    zh_CN: string
    fr_FR: string
    de_DE: string
}

export type ConnectedRealmsList = {
    _links: {
        self: Link
    }
    connected_realms: Link[]
}

type Status = {
    type: string
    name: string
}

type Population = {
    type: string
    name: string
}

type Region = {
    key: Link
    name: string | LocalizedString
    id: number
}

type RealmType = {
    type: string
    name: string
}

type Realm = {
    id: number
    region: Region
    connected_realm: Link
    name: string | LocalizedString
    category: string
    locale: string
    timezone: string
    type: RealmType
    is_tournament: boolean
    slug: string
}

export type ConnectedRealm = {
    _links: {
        self: Link
    }
    id: number
    has_queue: boolean
    status: Status
    population: Population
    realms: Realm[]
    mythic_leaderboards: Link
    auctions: Link
}

type ConnectedRealmResult = {
    key: Link
    data: ConnectedRealm
}

export type PaginatedConnectedRealms = {
    page: number
    pageSize: number
    maxPageSize: number
    pageCount: number
    results: ConnectedRealmResult[]
}
