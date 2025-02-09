import { Link } from './link'

type Period = {
    key: Link
    id: number
}

export type MythicKeystonePeriods = {
    _links: {
        self: Link
    }
    periods: Period[]
    current_period: {
        key: Link
        id: number
    }
}
