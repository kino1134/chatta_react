import { Router } from 'express'
import { token } from '../../service/passport'
import { validate } from '../../service/response'

import { post, get, getOne, getAll, update, destroy } from './controller'
import validator, { getValidator, updateValidator, destroyValidator } from './validator'

const router = new Router()

router.get('/', validate(getValidator, 'パラメータが間違っています'), token(), get)
router.post('/', validate(validator, 'パラメータが間違っています'), token(), post)
router.put('/:id', validate(updateValidator, 'パラメータが間違っています'), token(), update)
router.delete('/:id', validate(destroyValidator, 'パラメータが間違っています'), token(), destroy)

export default router
