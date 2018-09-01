import { Router } from 'express'
import { oAuthLogin, localLogin } from './controller'
import { google, github, password } from '../../service/passport'

const router = new Router()

router.get('/google', google(), oAuthLogin)
router.get('/github', github(), oAuthLogin)
router.post('/password', password(), localLogin)

export default router
