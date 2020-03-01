import { Router } from 'express'
import { token } from '../../service/passport'
import { validate } from '../../service/response'

import {
  showMe,
  create,
  updatePassword,
  updateProfile,
  initPassword,
  readMessage
} from './controller'
import validator, {
  updatePasswordValidator,
  updateProfileValidator,
  initPasswordValidator,
  readMessageValidator
} from './validator'

const router = new Router()

// ユーザを登録する
router.post('/',
  validate(validator, '入力内容が間違っています'),
  create)

// パスワードを初期化する
router.put('/password/init',
  validate(initPasswordValidator, '入力内容が間違っています'),
  initPassword)

// ログインユーザの情報を取得する
router.get('/me', token(), showMe)

// ログインユーザのパスワードを更新する
router.put('/password',
  token(),
  validate(updatePasswordValidator, '入力内容が間違っています'),
  updatePassword)

// ログインユーザの情報を更新する
router.put('/profile',
  token(),
  validate(updateProfileValidator, '入力内容が間違っています'),
  updateProfile)

// ログインユーザの既読メッセージを更新する
router.put('/read',
  token(),
  validate(readMessageValidator, '入力内容が間違っています'),
  readMessage)

export default router
