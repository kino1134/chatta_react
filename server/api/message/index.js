import { Router } from 'express'
import { token } from '../../service/passport'
import { validate } from '../../service/response'

import { post, getOne, getAll } from './controller'
import validator from './validator'

const router = new Router()

router.get('/one', token(), getOne)
router.get('/all', token(), getAll)
router.post('/', validate(validator, 'パラメータが間違っています'), token(), post)

export default router
