import { Router } from 'express'
import { show } from './controller'
export Hello, { schema } from './model'

const router = new Router()

/**
 * @api {get} /hellos/:id Retrieve hello
 * @apiName RetrieveHello
 * @apiGroup Hello
 * @apiSuccess {Object} hello Hello's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Hello not found.
 */
router.get('/:id',
  show)

export default router
