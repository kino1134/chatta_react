import * as jwt from '.'

it('sign and verify', () => {
  const obj = { value: 1 }
  const promise = jwt.sign(obj)
  expect(promise).resolves.toBeTruthy()

  const verify = promise.then(token => jwt.verify(token))
  expect(verify).resolves.toMatchObject(obj)
})
