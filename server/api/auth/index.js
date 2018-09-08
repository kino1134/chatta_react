import { Router } from 'express'
import { login } from './controller'
import validator from './validator'
import { google, github, password, token } from '../../service/passport'
import { validate } from '../../service/response'

const router = new Router()

router.get('/google', google(), login)
router.get('/github', github(), login)
router.post('/password', validate(validator, 'ログインに失敗しました。'), password(), login)
router.post('/refresh', token(), login)

export default router
