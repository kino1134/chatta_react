import { Router } from 'express'
import { token } from '../../service/passport'
import { validate } from '../../service/response'

import { post, get, getOne, getAll } from './controller'
import validator, { getValidator } from './validator'

const router = new Router()

router.get('/', validate(getValidator, 'パラメータが間違っています'), token(), get)
router.get('/one', token(), getOne)
router.get('/all', token(), getAll)
router.post('/', validate(validator, 'パラメータが間違っています'), token(), post)

export default router
