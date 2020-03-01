import fs from 'fs'
import multer from 'multer'
import onFinished from 'on-finished'

export default {
  single: (name) => (req, res, next) => {
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
}
