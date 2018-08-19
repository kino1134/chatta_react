import { Router } from 'express'
import hello from './hello'

const router = new Router()

// 以下、エンドポイントを順次追加
router.use('/hellos', hello)

export default router
