import { Router } from 'express'
import {
    fetchDungeonFrequency,
    fetchKeystoneFrequency,
    fetchPeriods,
    fetchSpecFrequency,
} from '../controllers/keystoneFrequencyController'

const router = Router()

router.get('/keystone-frequency', fetchKeystoneFrequency)

router.get('/spec-frequency', fetchSpecFrequency)

router.get('/dungeon-frequency', fetchDungeonFrequency)

router.get('/periods', fetchPeriods)

export default router
