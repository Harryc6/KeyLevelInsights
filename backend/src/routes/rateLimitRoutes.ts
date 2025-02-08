import { Router } from 'express'
import { fetchRateLimitData } from '../controllers/rateLimitController'

const router = Router()

router.get('/rate-limit', fetchRateLimitData)

export default router
