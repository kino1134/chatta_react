import { success } from '../../service/response'
import User from '../../model/User'

export const showMe = ({ user }, res) =>
  res.json(user.view(true))

export const create = (req, res, next) => {
  User.createFromLocal(req.body)
    .then(user => ({ userId: user.userId }))
    .then(success(res, 201))
    .catch(err => {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          message: 'IDはすでに使われています。',
          errors: {
            param: 'userId',
            msg: 'IDはすでに使われています。'
          }
        })
      } else {
        next(err)
      }
    })
}
