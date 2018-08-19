import request from 'supertest'
import { api } from 'config'
import express from 'config/express'
import routes, { Hello } from 'api/hello'

const app = () => express(api.root, routes)

let hello

beforeEach(async () => {
  hello = await Hello.create({})
})

test('GET /hellos/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${api.root}/${hello.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(hello.id)
})

test('GET /hellos/:id 404', async () => {
  const { status } = await request(app())
    .get(api.root + '/123456789098765432123456')
  expect(status).toBe(404)
})
