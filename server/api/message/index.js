import fs from 'fs'
import { Router } from 'express'
import multer from 'multer'
import onFinished from 'on-finished'
import { token } from '../../service/passport'
import { validate } from '../../service/response'

import { post, get, download, update, destroy, upload } from './controller'
import validator, { getValidator, updateValidator, idValidator } from './validator'

const router = new Router()

// TODO: 共通化したい
const fileUpload = (req, res, next) => {
  multer({ dest: 'upload/' }).single('attachFile')(req, res, err => {
    if (err) {
      return res.status(400).json({ message: '添付ファイルが処理できません' })
    }
    onFinished(res, function (_, res) {
      fs.unlinkSync(req.file.path)
    })
    next()
  })
}

router.get('/', validate(getValidator, 'パラメータが間違っています'), token(), get)
router.get('/download/:id', validate(idValidator, 'パラメータが間違っています'), token(), download)
router.post('/', validate(validator, 'パラメータが間違っています'), token(), post)
router.post('/upload', fileUpload, token(), upload)
router.put('/:id', validate(updateValidator, 'パラメータが間違っています'), token(), update)
router.delete('/:id', validate(idValidator, 'パラメータが間違っています'), token(), destroy)

export default router
