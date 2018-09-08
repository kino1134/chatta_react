import emitter from '../../config/socket_io/emitter'
import { success } from '../../service/response'
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

// TODO: ページングできるAPI

export const getOne = (req, res, next) => {
  Message.findOne().populate('user')
    .then(message => message.view())
    .then(success(res, 200))
    .catch(next)
}

export const getAll = (req, res, next) => {
  Message.find({}).populate('user')
    .then(messages => {
      const result = messages.map(m => m.view())
      return { messages: result }
    })
    .then(success(res, 200))
    .catch(next)
}
