import { Router } from 'express'
import hello from './hello'
import auth from './auth'
import user from './user'
import message from './message'

const router = new Router()

router.use('/hellos', hello)
router.use('/auth', auth)
router.use('/users', user)
router.use('/messages', message)

export default router
