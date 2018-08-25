import { Router } from 'express'
import hello from './hello'
import auth from './auth'

const router = new Router()

// 以下、エンドポイントを順次追加
router.use('/hellos', hello)
router.use('/auth', auth)

export default router
