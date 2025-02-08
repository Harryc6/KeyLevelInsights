import { Report } from './report'

export type ReportData = {
    report?(code: string): Report
    reports?(
        endTime?: number,
        guildID?: number,
        guildName?: string,
        guildServerSlug?: string,
        guildServerRegion?: string,
        guildTagID?: number,
        userID?: number,
        limit?: number,
        page?: number,
        startTime?: number,
        zoneID?: number,
        gameZoneID?: number
    ): Report[]
}
