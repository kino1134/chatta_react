import { Router } from 'express'
import { login } from './controller'
import { google, github } from '../../service/passport'

const router = new Router()

router.get('/google', google(), login)
router.get('/github', github(), login)

export default router
