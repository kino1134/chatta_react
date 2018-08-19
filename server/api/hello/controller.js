import { success, notFound } from '../../service/response/'
import { Hello } from '.'

export const show = ({ params }, res, next) =>
  Hello.findById(params.id)
    .then(notFound(res))
    .then((hello) => hello ? hello.view() : null)
    .then(success(res))
    .catch(next)
