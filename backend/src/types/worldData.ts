import { Encounter } from './encounter'
import { Expansion } from './expansion'
import { Region } from './region'
import { Server } from './server'
import { Subregion } from './subregion'
import { Zone } from './zone'

/**
 * Obtain the world data object that holds collections of data such as all expansions, regions, subregions, servers, dungeon/raid zones, and encounters.
 * @returns The world data object.
 *
 */
export type WorldData = {
    encounter?(id: number): Encounter
    expansion?(id: number): Expansion
    expansions?: Expansion[]
    regions?: Region[]
    server?(id: number, region: string, slug: string): Server
    subregion?(id: number): Subregion
    zone?(id: number): Zone
    zones?(expansion_id: number): Zone[]
}
