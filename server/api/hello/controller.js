import { success, notFound } from '../../service/response/'
import emitter from '../../config/socket_io/emitter'
import { Hello } from '.'

export const show = ({ params }, res, next) =>
  Hello.findById(params.id)
    .then(notFound(res))
    .then((hello) => hello ? hello.view() : null)
    .then(success(res))
    .catch(next)

export const emit = (req, res, next) => {
  emitter.emit('test', {message: 'Hello!'})
  Promise.resolve({})
    .then(success(res))
    .catch(next)
}
