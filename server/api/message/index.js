import { Router } from 'express'
import { token } from '../../service/passport'
import { validate } from '../../service/response'
import uploadFile from '../../service/upload_file'

import { post, get, download, update, destroy, upload } from './controller'
import validator, { getValidator, updateValidator, uploadValidator, idValidator } from './validator'

const router = new Router()

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
  uploadFile.single('attachFile'),
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
