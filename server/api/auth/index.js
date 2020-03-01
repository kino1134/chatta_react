import { Router } from 'express'
import { login } from './controller'
import validator from './validator'
import { google, github, password, token } from '../../service/passport'
import { validate } from '../../service/response'

const router = new Router()

// Google認証のコールバック
router.get('/google',
  google(),
  login)

// GitHub認証のコールバック
router.get('/github',
  github(),
  login)

// パスワードによる認証を行う
router.post('/password',
  validate(validator, 'ログインに失敗しました。'),
  password(),
  login)

// ログイントークンのリフレッシュを行う
router.post('/refresh',
  token(),
  login)

export default router
