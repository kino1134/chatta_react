import { sign } from '../../service/jwt'
import { success } from '../../service/response'

export const login = (req, res, next) => {
  // TODO レスポンス内容の精査
  console.log(req.user)
  sign(req.user)
    .then(token => ({
      token, user: req.user
    }))
    .then(success(res, 201))
    .catch(next)
}
