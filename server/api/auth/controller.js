import { sign } from '../../service/jwt'
// import { success } from '../../service/response'

export const oAuthLogin = (req, res, next) => {
  // TODO レスポンス内容の精査
  console.log(req.user)
  sign(req.user)
    .then(token => {
      res.render('oauth_login', {
        user: JSON.stringify(req.user),
        token
      })
    })
    .catch(next)
}
