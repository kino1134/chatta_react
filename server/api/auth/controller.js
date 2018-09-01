import { sign } from '../../service/jwt'
import { success } from '../../service/response'

export const oAuthLogin = ({ user }, res, next) => {
  sign({ id: user.id })
    .then(token => { res.render('oauth_login', { token }) })
    .catch(next)
}

export const localLogin = ({ user }, res, next) => {
  sign({ id: user.id })
    .then(token => ({ token }))
    .then(success(res, 200))
    .catch(next)
}
