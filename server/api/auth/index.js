import { Router } from 'express'
import { login } from './controller'
import { google } from '../../service/passport'

const router = new Router()

router.get('/google', google(), login)

export default router
