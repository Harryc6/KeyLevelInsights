import { GuildAttendance } from './guildAttendance'

export type GuildAttendancePagination = {
    data?: [GuildAttendance]
    total: number
    per_page: number
    current_page: number
    from?: number
    to?: number
    last_page: number
    has_more_pages: boolean
}
