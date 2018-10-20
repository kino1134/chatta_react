import request from 'supertest'
import { signSync } from '../../service/jwt'
import { api } from '../../config'
import express from '../../config/express'
import routes from '../../api/user'
import User from '../../model/User'

const app = () => express(api.root, routes)

let user1, session1

beforeEach(async () => {
  user1 = await User.create({ userId: 'jest-test', name: 'user', email: 'a@a.com', password: '12345678' })
  session1 = signSync({ id: user1.id })
})

test('GET /users/me 401', async () => {
  const { status } = await request(app())
    .get(api.root + '/me')
  expect(status).toBe(401)
})

test('GET /users/me 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(api.root + '/me')
    .query({ access_token: session1 })
  expect(status).toBe(200)
  expect(typeof body).toBe('object')
  expect(body.userId).toBe(user1.userId)
})
