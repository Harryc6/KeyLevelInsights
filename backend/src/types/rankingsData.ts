export type ReportData = {
    reportData: {
        reports: {
            data: {
                rankings: {
                    data: RankingsData[]
                }
            }[]
        }
    }
}

export type RankingsData = {
    fightID: number
    partition: number
    zone: number
    encounter: {
        id: number
        name: string
    }
    difficulty: number
    size: number
    kill: number
    duration: number
    bracketData: number
    deaths: number
    damageTakenExcludingTanks: number
    roles: {
        tanks: {
            name: string
            characters: {
                id: number
                name: string
                server: {
                    id: number
                    name: string
                    region: string
                }
                class: string
                spec: string
                amount: number
                bracketData: number
                bracket: number
                rank: string
                best: string
                totalParses: number
                bracketPercent: number
                rankPercent: number
            }[]
        }
        healers: {
            name: string
            characters: {
                id: number
                name: string
                server: {
                    id: number
                    name: string
                    region: string
                }
                class: string
                spec: string
                amount: number
                bracketData: number
                bracket: number
                rank: string
                best: string
                totalParses: number
                bracketPercent: number
                rankPercent: number
            }[]
        }
        dps: {
            name: string
            characters: {
                id: number
                name: string
                server: {
                    id: number
                    name: string
                    region: string
                }
                class: string
                spec: string
                amount: number
                bracketData: number
                bracket: number
                rank: string
                best: string
                totalParses: number
                bracketPercent: number
                rankPercent: number
            }[]
        }
    }
    bracket: number
    affixes: number[]
    team: {
        id: number
        name: string
        class: string
        spec: string
        role: string
    }[]
    computedScore: number
    medal: string
    reportsBlacklistForCharacters: string[]
    speed: {
        rank: string
        best: string
        totalParses: number
        rankPercent: number
    }
    score: {
        rank: string
        best: string
        totalParses: number
        rankPercent: number
    }
}
