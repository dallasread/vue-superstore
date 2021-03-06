import { reactive } from 'vue'
import Storage from './index.js'

const buildModel = (name, options) => {
  const models = {}

  models[name] = new Storage(reactive, models, name, options)

  return models[name]
}

describe('Models:Storage', () => {
  it('requires a store', () => {
    expect(() => buildModel('project')).toThrow(new Error('`Storage.options.store` is required'))
  })

  it('query', async () => {
    const store = { query: jest.fn(() => Promise.resolve()) }
    const subject = buildModel('project', { store })

    await subject.query()

    expect(store.query).toBeCalledWith(subject)
  })

  it('find', async () => {
    const store = { find: jest.fn(() => Promise.resolve()) }
    const subject = buildModel('project', { store })

    await subject.find(5)

    expect(store.find).toBeCalledWith(subject, 5)
  })

  it('save', async () => {
    const store = { save: jest.fn(() => Promise.resolve()) }
    const subject = buildModel('project', { store })

    await subject.save(4)

    expect(store.save).toBeCalledWith(subject, 4)
  })

  it('destroy', async () => {
    const store = { destroy: jest.fn(() => Promise.resolve()) }
    const subject = buildModel('project', { store })

    await subject.destroy(3)

    expect(store.destroy).toBeCalledWith(subject, 3)
  })

  it('reset', async () => {
    const store = { reset: jest.fn(() => Promise.resolve()) }
    const subject = buildModel('project', { store })

    await subject.reset()

    expect(store.reset).toBeCalledWith(subject)
  })
})
