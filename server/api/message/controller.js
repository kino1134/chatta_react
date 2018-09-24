import emitter from '../../config/socket_io/emitter'
import { success, notFound } from '../../service/response'
import Message from '../../model/Message'

export const post = (req, res, next) => {
  Message.create({ content: req.body.content, user: req.user })
    .then(message => message.view())
    .then(message => {
      emitter.emit('postMessage', message)
      return message
    })
    .then(success(res, 201))
    .catch(next)
}

export const update = ({ user, params, body }, res, next) => {
  Message.findOne({ _id: params.id, user: user._id }).populate('user')
    .then(notFound(res))
    .then(message => {
      if (!message) return null
      message.content = body.content
      message.save()
      return message
    })
    .then(message => {
      emitter.emit('updateMessage', message.view())
      return message
    })
    .then(success(res))
    .catch(next)
}

export const destroy = ({ user, params }, res, next) => {
  Message.findOne({ _id: params.id, user: user._id }).populate('user')
    .then(notFound(res))
    .then(message => message ? message.remove() : null)
    .then(message => {
      emitter.emit('removeMessage', message.view())
      return message
    })
    .then(success(res, 204))
    .catch(next)
}

export const get = (req, res, next) => {
  // 1回あたりの取得件数は20とする
  // 残り1件は、次のページングを行うためのID取得用
  const max = 20 + 1
  const cond = req.query.last ? { _id: { $lte: req.query.last } } : {}

  Message.find(cond).sort({ _id: -1 }).limit(max).populate('user')
    .then(messages => {
      const views = messages.map(m => m.view()).reverse()
      if (views.length === max) {
        const [head, ...rest] = views
        return { previous: head.id, messages: rest }
      } else {
        return { previous: null, messages: views }
      }
    })
    .then(success(res, 200))
    .catch(next)
}
