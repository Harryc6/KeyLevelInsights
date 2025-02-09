import { Router } from 'express'

import {
    fetchCurrentMythicLeaderboardDungeonByDungeon,
    fetchMythicLeaderboard,
    fetchMythicLeaderboardByDungeonAndPeriod,
} from '../controllers/mythicLeaderboadController'

const router = Router()

router.get(
    '/mythic-leaderboard/:connectedRealmId/dungeon/:dungeonId/period/:period',
    fetchMythicLeaderboardByDungeonAndPeriod
)

router.get('/mythic-leaderboard/:connectedRealmId/dungeon/:dungeonId', fetchCurrentMythicLeaderboardDungeonByDungeon)

router.get('/mythic-leaderboard/:connectedRealmId', fetchMythicLeaderboard)

export default router
