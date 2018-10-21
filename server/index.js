import http from 'http'
import { createClient } from 'redis'
import config from './config'
import express from './config/express'
import mongoose from './config/mongoose'
import socketIo from './config/socket_io'
import api from './api'

const app = express(config.api.root, api)
const server = http.createServer(app)
const io = socketIo(createClient)

mongoose.connect(config.mongo.uri, {
  useNewUrlParser: true,
  user: config.mongo.user,
  pass: config.mongo.password
})

server.listen(config.api.port, config.api.ip, () => {
  console.log('Express server listening on http://%s:%d in %s mode',
    config.api.ip, config.api.port, config.env)
})

io.listen(config.socket.port || server)
