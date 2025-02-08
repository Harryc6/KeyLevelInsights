import { Router } from 'express'
import {
    fetchConnectedRealmNames,
    fetchConnectedRealms,
    fetchSpecificConnectedRealm,
} from '../controllers/connectedRealmController'

const router = Router()

router.get('/connected-realms/index', fetchConnectedRealms)

router.get('/connected-realms/names', fetchConnectedRealmNames)

router.get('/connected-realms/:connectedRealmId', fetchSpecificConnectedRealm)

export default router
