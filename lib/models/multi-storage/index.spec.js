import MultiStorage from './index.js'

class Local extends Array {
  constructor () {
    super()

    this.query = jest.fn(() => new Promise((resolve) => resolve()))
    this.find = jest.fn(() => new Promise((resolve) => resolve()))
    this.save = jest.fn(() => new Promise((resolve) => resolve()))
    this.destroy = jest.fn(() => new Promise((resolve) => resolve()))
  }
}

class Remote extends Local {}

describe('Models:MultiStorage', () => {
  it('requires stores', () => {
    expect(() => {
      new MultiStorage() // eslint-disable-line no-new
    }).toThrow(new Error('`MultiStorage.options.stores` is required'))
  })

  it('builds default strategies', () => {
    const subject = new MultiStorage({ stores: { local: new Local(), remote: new Remote() } })
    const strategies = subject._buildDefaultStrategies()

    expect(strategies).toBeInstanceOf(Object)
    expect(strategies).toEqual({
      query: { local: 'synchronous', remote: 'asynchronous' },
      find: { local: 'synchronous', remote: 'asynchronous' },
      save: { local: 'synchronous', remote: 'asynchronous' },
      destroy: { local: 'synchronous', remote: 'asynchronous' }
    })
  })

  describe('builds actions', () => {
    it('synchronous', () => {
      const subject = new MultiStorage({ stores: { local: new Local(), remote: new Remote() } })
      const synchronousActions = subject._actionsByStrategy('synchronous', 'query')

      expect(synchronousActions).toContain(subject.stores.local.query)
      expect(synchronousActions).not.toContain(subject.stores.remote.query)
    })

    it('asynchronous', () => {
      const subject = new MultiStorage({ stores: { local: new Local(), remote: new Remote() } })
      const asynchronousActions = subject._actionsByStrategy('asynchronous', 'query')

      expect(asynchronousActions).not.toContain(subject.stores.local.query)
      expect(asynchronousActions).toContain(subject.stores.remote.query)
    })
  })

  it('query', async () => {
    const subject = new MultiStorage({ stores: { local: new Local(), remote: new Remote() } })

    await subject.query()

    expect(subject.stores.local.query).toBeCalled()
    expect(subject.stores.remote.query).toBeCalled()
  })

  it('find', async () => {
    const subject = new MultiStorage({ stores: { local: new Local(), remote: new Remote() } })

    await subject.find(1)

    expect(subject.stores.local.find).toBeCalledWith(1)
    expect(subject.stores.remote.find).toBeCalledWith(1)
  })

  it('save', async () => {
    const subject = new MultiStorage({ stores: { local: new Local(), remote: new Remote() } })
    const obj = { id: 1 }

    await subject.save(obj)

    expect(subject.stores.local.save).toBeCalledWith(obj)
    expect(subject.stores.remote.save).toBeCalledWith(obj)
  })

  it('destroy', async () => {
    const subject = new MultiStorage({ stores: { local: new Local(), remote: new Remote() } })
    const obj = { id: 1 }

    await subject.destroy(obj)

    expect(subject.stores.local.destroy).toBeCalledWith(obj)
    expect(subject.stores.remote.destroy).toBeCalledWith(obj)
  })
})
