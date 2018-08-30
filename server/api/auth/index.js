import { Router } from 'express'
import { oauthLogin } from './controller'
import { google, github } from '../../service/passport'

const router = new Router()

router.get('/google', google(), oauthLogin)
router.get('/github', github(), oauthLogin)

export default router
