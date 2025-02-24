import { Router } from 'express'
import { fetchKeystoneFrequency, fetchSpecFrequency } from '../controllers/keystoneFrequencyController'

const router = Router()

router.get('/keystone-frequency', fetchKeystoneFrequency)

router.get('/keystone-frequency/period/:period', fetchKeystoneFrequency)

router.get('/keystone-frequency/dungeon/:dungeon', fetchKeystoneFrequency)

router.get('/keystone-frequency/period/:period/dungeon/:dungeon', fetchKeystoneFrequency)

router.get('/spec-frequency', fetchSpecFrequency)

router.get('/spec-frequency/:period', fetchSpecFrequency)

export default router
