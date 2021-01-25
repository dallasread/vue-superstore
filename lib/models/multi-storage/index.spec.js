import { reactive, computed } from 'vue'
import MultiStorage from './index.js'
import Local from '../../stores/local/index.js'
import Rest from '../../stores/rest/index.js'

const buildModel = (name, options) => {
  const models = {}

  models[name] = new MultiStorage(reactive, computed, models, name, options)

  return models[name]
}

class FakeLocal extends Array {
  constructor () {
    super()

    this.query = jest.fn(() => new Promise((resolve) => resolve()))
    this.find = jest.fn(() => new Promise((resolve) => resolve()))
    this.save = jest.fn(() => new Promise((resolve) => resolve()))
    this.destroy = jest.fn(() => new Promise((resolve) => resolve()))
    this.reset = jest.fn(() => new Promise((resolve) => resolve()))
  }
}

class FakeRemote extends FakeLocal {}

describe('Models:MultiStorage', () => {
  it('requires stores', () => {
    expect(() => buildModel('projects')).toThrow(new Error('`MultiStorage.options.stores` is required'))
  })

  it('builds out configured stores', () => {
    const subject = buildModel('projects', { stores: { local: { type: 'Local', name: 'local' }, remote: { type: 'Rest', url: 'local' } } })

    expect(subject.stores.local).toBeInstanceOf(Local)
    expect(subject.stores.remote).toBeInstanceOf(Rest)
  })

  it('builds default strategies', () => {
    const subject = buildModel('projects', { stores: { local: new FakeLocal(), remote: new FakeRemote() } })
    const strategies = subject._buildDefaultStrategies()

    expect(strategies).toBeInstanceOf(Object)
    expect(strategies).toEqual({
      query: { local: 'synchronous', remote: 'asynchronous' },
      find: { local: 'synchronous', remote: 'asynchronous' },
      save: { local: 'synchronous', remote: 'asynchronous' },
      destroy: { local: 'synchronous', remote: 'asynchronous' },
      reset: { local: 'synchronous', remote: 'asynchronous' }
    })
  })

  describe('builds actions', () => {
    it('synchronous', () => {
      const subject = buildModel('projects', { stores: { local: new FakeLocal(), remote: new FakeRemote() } })
      const synchronousStores = subject._actionsByStrategy('synchronous', 'query')

      expect(synchronousStores).toContain(subject.stores.local)
      expect(synchronousStores).not.toContain(subject.stores.remote)
    })

    it('asynchronous', () => {
      const subject = buildModel('projects', { stores: { local: new FakeLocal(), remote: new FakeRemote() } })
      const asynchronousStores = subject._actionsByStrategy('asynchronous', 'query')

      expect(asynchronousStores).not.toContain(subject.stores.local)
      expect(asynchronousStores).toContain(subject.stores.remote)
    })
  })

  it('query', async () => {
    const subject = buildModel('projects', { stores: { local: new FakeLocal(), remote: new FakeRemote() } })

    await subject.query()

    expect(subject.stores.local.query).toBeCalledWith(subject)
    expect(subject.stores.remote.query).toBeCalledWith(subject)
  })

  it('find', async () => {
    const subject = buildModel('projects', { stores: { local: new FakeLocal(), remote: new FakeRemote() } })

    await subject.find(1)

    expect(subject.stores.local.find).toBeCalledWith(subject, 1)
    expect(subject.stores.remote.find).toBeCalledWith(subject, 1)
  })

  it('save', async () => {
    const subject = buildModel('projects', { stores: { local: new FakeLocal(), remote: new FakeRemote() } })
    const obj = { id: 1 }

    await subject.save(obj)

    expect(subject.stores.local.save).toBeCalledWith(subject, obj)
    expect(subject.stores.remote.save).toBeCalledWith(subject, obj)
  })

  it('destroy', async () => {
    const subject = buildModel('projects', { stores: { local: new FakeLocal(), remote: new FakeRemote() } })
    const obj = { id: 1 }

    await subject.destroy(obj)

    expect(subject.stores.local.destroy).toBeCalledWith(subject, obj)
    expect(subject.stores.remote.destroy).toBeCalledWith(subject, obj)
  })

  it('reset', async () => {
    const subject = buildModel('projects', { stores: { local: new FakeLocal(), remote: new FakeRemote() } })

    await subject.reset()

    expect(subject.stores.local.reset).toBeCalledWith(subject)
    expect(subject.stores.remote.reset).toBeCalledWith(subject)
  })
})
