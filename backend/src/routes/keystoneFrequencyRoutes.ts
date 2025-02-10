import { Router } from 'express'
import { fetchKeystoneFrequency } from '../controllers/keystoneFrequencyController'

const router = Router()

router.get('/keystone-frequency', fetchKeystoneFrequency)

export default router
