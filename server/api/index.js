import { Router } from 'express'
import auth from './auth'
import user from './user'
import message from './message'

const router = new Router()

router.use('/auth', auth)
router.use('/users', user)
router.use('/messages', message)

export default router
