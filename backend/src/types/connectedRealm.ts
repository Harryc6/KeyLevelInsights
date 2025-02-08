import { BNetPath } from '../utils/bNetQuery'

type ConnectedRealmLink = {
    href: BNetPath
}

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

type Links = {
    self: ConnectedRealmLink
}

export type ConnectedRealmsList = {
    _links: Links
    connected_realms: ConnectedRealmLink[]
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
    key: ConnectedRealmLink
    name: string
    id: number
}

type RealmType = {
    type: string
    name: string
}

type Realm = {
    id: number
    region: Region
    connected_realm: ConnectedRealmLink
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
        self: ConnectedRealmLink
    }
    id: number
    has_queue: boolean
    status: Status
    population: Population
    realms: Realm[]
    mythic_leaderboards: ConnectedRealmLink
    auctions: ConnectedRealmLink
}

type ConnectedRealmResult = {
    key: ConnectedRealmLink
    data: ConnectedRealm
}

export type PaginatedConnectedRealms = {
    page: number
    pageSize: number
    maxPageSize: number
    pageCount: number
    results: ConnectedRealmResult[]
}
