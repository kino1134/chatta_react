import { Hello } from 'api/hello'

let hello

beforeEach(async () => {
  hello = await Hello.create({ message: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = hello.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(hello.id)
    expect(view.message).toBe(hello.message)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = hello.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(hello.id)
    expect(view.message).toBe(hello.message)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
