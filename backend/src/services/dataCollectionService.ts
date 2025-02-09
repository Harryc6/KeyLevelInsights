import { getConnectedRealmIDs } from './connectedRealmService'
import { getCurrentPeriod } from './mythicKeystoneService'
import { getMythicLeaderboardByDungeonAndPeriod } from './mythicLeaderboadService'
import { insertCharacters, insertRuns } from './runService'
import Bottleneck from 'bottleneck'

const dungeonMap = new Map<string, number>([
    ['Ara Kara', 503],
    ['Stonevault', 501],
    ['Dawn Breaker', 505],
    ['Grim Batol', 507],
    ['City Of Threads', 502],
    ['Necrotic Wake', 1182],
    ['Mist Of Tirna Scithe', 1184],
])

const dungeonIDs = Array.from(dungeonMap.values())

const tankSpecMap = new Map<string, number>([
    ['Protection - Paladin', 66],
    ['Brewmaster - Monk', 268],
    ['Protection - Warrior', 73],
    ['Guardian - Druid', 104],
    ['Blood - Death Knight', 250],
    ['Vengeance - Demon Hunter', 581],
])

const tankIDs = Array.from(tankSpecMap.values())

const healerSpecMap = new Map<string, number>([
    ['Mistweaver - Monk', 270],
    ['Discipline - Priest', 256],
    ['Restoration - Shaman', 264],
    [`Holy - Paladin`, 65],
    ['Holy - Priest', 257],
    [`Preservation - Evoker`, 1468],
    ['Restoration - Druid', 105],
])

const healerIDs = Array.from(healerSpecMap.values())

const dpsSpecMap = new Map<string, number>([
    [`Enhancement - Shaman`, 263],
    [`Survival - Hunter`, 255],
    [`Fury - Warrior`, 72],
    [`Unholy - Death Knight`, 252],
    [`Assassination - Rogue`, 259],
    [`Frost - Mage`, 64],
    [`Arcane - Mage`, 62],
    [`Retribution - Paladin`, 70],
    [`Arms - Warrior`, 71],
    [`Beast Mastery - Hunter`, 253],
    [`Marksmanship - Hunter`, 254],
    [`Shadow - Priest`, 258],
    [`Subtlety - Rogue`, 261],
    [`Feral - Druid`, 103],
    [`Fire - Mage`, 63],
    [`Frost - Death Knight`, 251],
    [`Outlaw - Rogue`, 260],
    [`Affliction - Warlock`, 265],
    [`Demonology - Warlock`, 266],
    [`Windwalker - Monk`, 269],
    [`Balance - Druid`, 102],
    [`Havoc - Demon Hunter`, 577],
    [`Devastation - Evoker`, 1467],
    [`Augmentation - Evoker`, 1473],
    [`Elemental - Shaman`, 262],
    [`Destruction - Warlock`, 267],
])

const dpsIDs = Array.from(dpsSpecMap.values())

const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 1000 / 300 })
const getMythicLeaderboardByDungeonAndPeriodLimited = limiter.wrap(getMythicLeaderboardByDungeonAndPeriod)

export const collectAndStoreRuns = async () => {
    const [connectedRealmIDs, currentPeriod] = await Promise.all([getConnectedRealmIDs(), getCurrentPeriod()])

    console.log(`Collecting leaderboards for ${Array.from(dungeonMap.keys())[0]} (${dungeonIDs[0]})...`)
    const leaderboards = await Promise.all(
        connectedRealmIDs.map((id) => getMythicLeaderboardByDungeonAndPeriodLimited(id, dungeonIDs[0], currentPeriod))
    )

    const uniqueRuns = leaderboards
        .flatMap((board) => board.leading_groups)
        .filter(Boolean)
        .sort((a, b) => b.keystone_level - a.keystone_level || b.mythic_rating.rating - a.mythic_rating.rating)
        .filter(
            (run, index, self) =>
                self.findIndex(
                    (r) =>
                        r.mythic_rating.rating === run.mythic_rating.rating &&
                        r.duration === run.duration &&
                        r.keystone_level === run.keystone_level &&
                        r.completed_timestamp === run.completed_timestamp &&
                        r.members.every((m, i) => m.profile.name === run.members[i].profile.name)
                ) === index
        )

    // take the unique runs and grab all unique characters
    const uniqueCharacters = uniqueRuns
        .flatMap((run) => run.members)
        .filter((character, index, self) => self.findIndex((c) => c.profile.id === character.profile.id) === index)

    // log group information
    console.info(`****************************************************************`)
    console.info(
        `Leaderboards for ${Array.from(dungeonMap.keys())[0]} (${dungeonIDs[0]}) for period ${currentPeriod} collected`
    )
    console.info(`Total connected realms: ${connectedRealmIDs.length}`)
    console.info(`Total runs: ${leaderboards.flatMap((board) => board.leading_groups).length}`)
    console.info(`Unique runs: ${uniqueRuns.length}`)
    console.info(`****************************************************************`)

    const runs = uniqueRuns.map((run) => ({
        dungeon: dungeonIDs[0],
        keystone_level: run.keystone_level,
        rating: run.mythic_rating.rating,
        duration: run.duration,
        completed_timestamp: run.completed_timestamp,
        period: currentPeriod,
        // find any tank specializations in the run and place their profile id in the tank field
        tank: run.members
            .filter((member) => tankIDs.includes(member.specialization.id))
            .map((member) => member.profile.id),
        // find any healer specializations in the run and place their profile id in the healer field
        healer: run.members
            .filter((member) => healerIDs.includes(member.specialization.id))
            .map((member) => member.profile.id),
        // find any dps specializations in the run and place their profile id in the dps field
        dps: run.members
            .filter((member) => dpsIDs.includes(member.specialization.id))
            .map((member) => member.profile.id),
    }))

    await insertRuns(runs)

    const characters = uniqueCharacters.map((member) => ({
        character_id: member.profile.id,
        name: member.profile.name,
        realm: member.profile.realm.id,
    }))

    await insertCharacters(characters)
}
