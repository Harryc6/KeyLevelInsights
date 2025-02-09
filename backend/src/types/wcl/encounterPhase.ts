import { PhaseMetadata } from './phaseMetadata'

export type EncounterPhase = {
    encounterID: number
    separateWipes?: boolean
    phases: PhaseMetadata[]
}
