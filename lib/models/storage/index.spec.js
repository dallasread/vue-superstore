import { computed } from 'vue'
import Storage from './index.js'

const buildModel = (name, options) => {
  const models = {}

  models[name] = new Storage(computed, models, name, options)

  return models[name]
}

describe('Models:Storage', () => {
  it('requires a store', () => {
    expect(() => {
      buildModel('projects') // eslint-disable-line no-new
    }).toThrow(new Error('`Storage.options.store` is required'))
  })

  it('query', async () => {
    const store = { query: jest.fn(() => Promise.resolve()) }
    const subject = buildModel('projects', { store })

    await subject.query()

    expect(store.query).toBeCalledWith(subject)
  })

  it('find', async () => {
    const store = { find: jest.fn(() => Promise.resolve()) }
    const subject = buildModel('projects', { store })

    await subject.find(5)

    expect(store.find).toBeCalledWith(subject, 5)
  })

  it('save', async () => {
    const store = { save: jest.fn(() => Promise.resolve()) }
    const subject = buildModel('projects', { store })

    await subject.save(4)

    expect(store.save).toBeCalledWith(subject, 4)
  })

  it('destroy', async () => {
    const store = { destroy: jest.fn(() => Promise.resolve()) }
    const subject = buildModel('projects', { store })

    await subject.destroy(3)

    expect(store.destroy).toBeCalledWith(subject, 3)
  })
})
