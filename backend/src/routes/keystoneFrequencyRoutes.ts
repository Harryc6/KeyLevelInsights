import { Router } from 'express'
import {
    fetchDungeonFrequency,
    fetchKeystoneFrequency,
    fetchSpecFrequency,
} from '../controllers/keystoneFrequencyController'

const router = Router()

router.get('/keystone-frequency', fetchKeystoneFrequency)

router.get('/spec-frequency', fetchSpecFrequency)

router.get('/dungeon-frequency', fetchDungeonFrequency)

export default router
