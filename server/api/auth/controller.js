import { sign } from '../../service/jwt'
import { success } from '../../service/response'

export const login = ({ user }, res, next) => {
  sign({ id: user.id })
    .then(token => ({ token }))
    .then(success(res, 200))
    .catch(next)
}
