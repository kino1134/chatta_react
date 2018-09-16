import { Router } from 'express'
import { token } from '../../service/passport'
import { validate } from '../../service/response'

import { showMe, create, updatePassword, initPassword } from './controller'
import validator, { updatePasswordValidator, initPasswordValidator } from './validator'

const router = new Router()

router.get('/me', token(), showMe)
router.post('/', validate(validator, '入力内容が間違っています'), create)
router.put('/password', token(), validate(updatePasswordValidator, '入力内容が間違っています'), updatePassword)
router.put('/password/init', validate(initPasswordValidator, '入力内容が間違っています'), initPassword)

export default router
