import { Router } from 'express'
import { token } from '../../service/passport'

import { showMe } from './controller'

const router = new Router()

router.get('/me', token(), showMe)

export default router
