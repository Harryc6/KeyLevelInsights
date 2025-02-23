export type Run = {
    dungeon: number
    keystone_level: number
    rating: number
    duration: number
    completed_timestamp: number
    period: number
    tank: RunMember[]
    healer: RunMember[]
    dps: RunMember[]
}

export type RunMember = {
    character_id: number
    spec_id: number
}
