import request from 'supertest'
import { api } from '../../config'
import express from '../../config/express'
import routes from '.'

const app = () => express(api.root, routes)

test('not implementation', async () => {
  const res = await request(app()).post(api.root + '/password')
  expect(res).toBeTruthy()
})
