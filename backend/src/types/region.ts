import { Subregion } from './subregion'
import { ServerPagination } from './serverPagination'

export type Region = {
    id: number
    compactName: string
    name: string
    slug: string
    subregions?: Subregion[]
    servers?(limit: number, page: number): ServerPagination
}
