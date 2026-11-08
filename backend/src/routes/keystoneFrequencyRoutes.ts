import { Router } from 'express'
import {
    fetchDungeonFrequency,
    fetchKeystoneFrequency,
    fetchPeriods,
    fetchSpecFrequency,
} from '../controllers/keystoneFrequencyController'
import { fetchMetadata } from '../controllers/metadataController'

const router = Router()

router.get('/keystone-frequency/:period', fetchKeystoneFrequency)

router.get('/spec-frequency/:period', fetchSpecFrequency)

router.get('/dungeon-frequency/:period', fetchDungeonFrequency)

router.get('/periods', fetchPeriods)

router.get('/metadata', fetchMetadata)

export default router
