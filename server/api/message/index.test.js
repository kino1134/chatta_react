import request from 'supertest'
import { api } from '../../config'
import express from '../../config/express'
import routes from '.'

const app = () => express(api.root, routes)

test('not implementation', async () => {
  const res = await request(app()).get(api.root + '/')
  expect(res).toBeTruthy()
})
