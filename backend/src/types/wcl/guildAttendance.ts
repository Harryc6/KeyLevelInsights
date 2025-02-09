import { Zone } from './zone'
import { PlayerAttendance } from './playerAttendance'

export type GuildAttendance = {
    code: string
    players?: PlayerAttendance[]
    startTime: number
    zone: Zone
}
