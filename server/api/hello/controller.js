import { success, notFound, error } from '../../service/response/'
import { Hello } from '.'

export const show = ({ params }, res, next) =>
  Hello.findById(params.id)
    .then(notFound(res))
    .then((hello) => hello ? hello.view() : null)
    .then(success(res))
    .catch(error(res, next))
