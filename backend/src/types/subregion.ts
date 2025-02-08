import { Region } from './region'
import { ServerPagination } from './serverPagination'

export type Subregion = {
    id: number
    name: string
    region: Region
    servers?(limit: number, page: number): ServerPagination
}
