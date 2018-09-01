import { Router } from 'express'
import { token } from '../../service/passport'
import { validate } from '../../service/response'

import { showMe, create } from './controller'
import validator from './validator'

const router = new Router()

router.get('/me', token(), showMe)
router.post('/', validate(validator, '入力内容が間違っています。'), create)

export default router
