import { success } from '../../service/response'
import User from '../../model/User'

export const showMe = ({ user }, res) =>
  res.json(user.view(true))

export const updatePassword = ({ user, body }, res, next) => {
  user.authenticate(body.current)
    .then(user => {
      if (user) {
        user.password = body.newer
        user.save()
          .then(() => res.json({ message: 'パスワードが変更されました' }))
          .catch(next)
      } else {
        res.status(400).json({ message: '今のパスワードが間違っています' })
      }
    })
    .catch(next)
}

export const create = (req, res, next) => {
  User.createFromLocal(req.body)
    .then(user => ({ userId: user.userId }))
    .then(success(res, 201))
    .catch(err => {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          message: '入力内容が正しくありません',
          errors: [
            { param: 'userId', msg: 'IDはすでに使われています' }
          ]
        })
      } else {
        next(err)
      }
    })
}
