import { Router } from 'express'
import { token } from '../../service/passport'
import { validate } from '../../service/response'

import { showMe, create, updatePassword, updateProfile, initPassword } from './controller'
import validator, { updatePasswordValidator, updateProfileValidator, initPasswordValidator } from './validator'

const router = new Router()

router.post('/', validate(validator, '入力内容が間違っています'), create)
router.put('/password/init', validate(initPasswordValidator, '入力内容が間違っています'), initPassword)
router.get('/me', token(), showMe)
router.put('/password', token(), validate(updatePasswordValidator, '入力内容が間違っています'), updatePassword)
router.put('/profile', token(), validate(updateProfileValidator, '入力内容が間違っています'), updateProfile)

export default router
