import crypto from 'crypto'
import mongoose from 'mongoose'
import mailer from '../service/mailer'
import User from './User'

let user

beforeEach(async () => {
  user = await User.create({ userId: 'uid', displayName: 'name', email: 'test@example.com', password: '12345678', photo: 'http://test.example.com/photo', readMessage: mongoose.Types.ObjectId() })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = user.view()
    expect(view).toBeDefined()
    expect(view.userId).toBe(user.userId)
    expect(view.displayName).toBe(user.displayName)
    expect(view.photo).toBe(user.photo)
  })

  it('returns full view', () => {
    const view = user.view(true)
    expect(view).toBeDefined()
    expect(view.userId).toBe(user.userId)
    expect(view.displayName).toBe(user.displayName)
    expect(view.photo).toBe(user.photo)
    expect(view.email).toBe(user.email)
    expect(view.createdAt).toEqual(user.createdAt)
    expect(view.readMessage).toBe(user.readMessage)
  })
})

describe('authenticate', () => {
  it('returns the user when authentication succeed', async () => {
    expect(await user.authenticate('12345678')).toBe(user)
  })

  it('returns false when authentication fails', async () => {
    expect(await user.authenticate('blah')).toBe(false)
  })
})

describe('createFromLocal', () => {
  let localUser
  let sendMail
  beforeEach(() => {
    localUser = { email: 'test@example.com', displayName: 'name' }
    sendMail = jest.spyOn(mailer, 'send')
  })

  it('create User', async () => {
    const createdUser = await User.createFromLocal(localUser)
    const hash = crypto.createHash('md5').update(createdUser.email).digest('hex')
    expect(createdUser.userId).toBe('test')
    expect(createdUser.photo).toBe(`https://gravatar.com/avatar/${hash}?d=identicon`)
    expect(createdUser.password).toBeDefined()
    expect(sendMail).toBeCalledWith(expect.objectContaining({
      to: createdUser.email
    }))
  })

  it('create User and Id', async () => {
    localUser.userId = '1234abcd'
    const createdUser = await User.createFromLocal(localUser)
    expect(createdUser.userId).toBe('1234abcd')
  })
})

describe('createFromService', () => {
  let serviceUser
  beforeEach(() => {
    serviceUser = {
      provider: 'dummy',
      id: '123',
      displayName: 'Test Name',
      emails: [{ value: 'test@example.com' }],
      photos: [{ value: 'test.jpg' }]
    }
  })

  it('creates a new user', async () => {
    const createdUser = await User.createFromService(serviceUser)
    expect(createdUser.userId).toBeDefined()
    expect(createdUser.providerId).toBe(serviceUser.provider + '_' + serviceUser.id)
    expect(createdUser.displayName).toBe(serviceUser.displayName)
    expect(createdUser.email).toBe(serviceUser.emails[0].value)
    expect(createdUser.photo).toBe(serviceUser.photos[0].value)
  })

  it('already registered', async () => {
    const createdUser = await User.createFromService(serviceUser)
    const registeredUser = await User.createFromService({...serviceUser,
      displayName: 'xxx',
      emails: [{ value: 'aaa@bbb.ccc' }],
      photos: [{ value: 'www.png' }]})
    expect(registeredUser.id).toBe(createdUser.id)
    expect(registeredUser.providerId).toBe(createdUser.providerId)
    expect(registeredUser.displayName).toBe(createdUser.displayName)
    expect(registeredUser.email).toBe(createdUser.email)
    expect(registeredUser.photo).toBe(createdUser.photo)
    expect(registeredUser.updatedAt).toEqual(createdUser.updatedAt)
  })
})
