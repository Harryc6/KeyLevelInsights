import { Encounter } from './encounter'
import { Bracket } from './bracket'
import { Difficulty } from './difficulty'

export type Zone = {
    id: number
    brackets?: Bracket
    difficulties?: Difficulty[]
    expansionId: number
    encounters?: Encounter[]
}
