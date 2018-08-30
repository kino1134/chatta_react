import { Router } from 'express'
import { oAuthLogin } from './controller'
import { google, github } from '../../service/passport'

const router = new Router()

router.get('/google', google(), oAuthLogin)
router.get('/github', github(), oAuthLogin)

export default router
