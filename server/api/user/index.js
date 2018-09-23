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

router.post('/', validate(validator, '入力内容が間違っています'), create)
router.put('/password/init', validate(initPasswordValidator, '入力内容が間違っています'), initPassword)
router.get('/me', token(), showMe)
router.put('/password', token(), validate(updatePasswordValidator, '入力内容が間違っています'), updatePassword)
router.put('/profile', token(), validate(updateProfileValidator, '入力内容が間違っています'), updateProfile)
router.put('/read', token(), validate(readMessageValidator, '入力内容が間違っています'), readMessage)

export default router
