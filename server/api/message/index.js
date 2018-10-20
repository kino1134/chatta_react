import fs from 'fs'
import { Router } from 'express'
import multer from 'multer'
import onFinished from 'on-finished'
import { token } from '../../service/passport'
import { validate } from '../../service/response'

import { post, get, download, update, destroy, upload } from './controller'
import validator, { getValidator, updateValidator, uploadValidator, idValidator } from './validator'

const router = new Router()

// TODO: 共通化したい
const uploadSingle = (name) => (req, res, next) => {
  multer({ dest: 'upload/' }).single(name)(req, res, err => {
    if (err) {
      return res.status(400).json({ message: '添付ファイルが処理できません' })
    }
    // レスポンスを返す際、一時ファイルを削除する
    onFinished(res, function (_, res) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
    })
    next()
  })
}

// 指定されたメッセージから最新２０件を取得する
router.get('/',
  validate(getValidator, 'パラメータが間違っています'),
  token(),
  get)

// メッセージに添付されたファイルを取得する
router.get('/download/:id',
  validate(idValidator, 'パラメータが間違っています'),
  token(),
  download)

// メッセージを登録する
router.post('/',
  validate(validator, 'パラメータが間違っています'),
  token(),
  post)

// メッセージ＋ファイルを登録する
router.post('/upload',
  uploadSingle('attachFile'),
  validate(uploadValidator, 'パラメータが間違っています'),
  token(),
  upload)

// メッセージを更新する
router.put('/:id',
  validate(updateValidator, 'パラメータが間違っています'),
  token(),
  update)

// メッセージを削除する
router.delete('/:id',
  validate(idValidator, 'パラメータが間違っています'),
  token(),
  destroy)

export default router
