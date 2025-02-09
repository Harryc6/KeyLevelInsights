import { Router } from 'express'
import {
    fetchMythicKeystoneDungeons,
    fetchMythicKeystonePeriods,
    fetchMythicKeystoneSeasons,
} from '../controllers/mythicKeystoneController'

const router = Router()

router.get('/mythic-keystone/dungeons', fetchMythicKeystoneDungeons)

router.get('/mythic-keystone/periods', fetchMythicKeystonePeriods)

router.get('/mythic-keystone/seasons', fetchMythicKeystoneSeasons)

export default router
