import { Router } from 'express'
import { show } from './controller'
import { google } from '../../service/passport'
export Hello, { schema } from './model'

const router = new Router()

// TODO: ちゃんとした場所に移動させる
router.get('/auth', google({ scope: ['openid', 'email', 'profile'] }))
router.get('/callback', google(), (req, res) => {
  console.log(req.user)
  res.json(req.user).status(200)
})

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
