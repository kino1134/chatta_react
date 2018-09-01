import { Router } from 'express'
import { oAuthLogin, localLogin } from './controller'
import validator from './validator'
import { google, github, password } from '../../service/passport'
import { validate } from '../../service/response'

const router = new Router()

router.get('/google', google(), oAuthLogin)
router.get('/github', github(), oAuthLogin)
router.post('/password', validate(validator, 'ログインに失敗しました。'), password(), localLogin)

export default router
