// - attach multiple storage methods
// - each method should call all storage methods
// -

import StorageModel from './index.js'

describe('Models:Storage', () => {
  it('requires a store', () => {
    expect(() => {
      new StorageModel()
    }).toThrow(new Error('`StorageModel.options.store` is required'))
  })

  it('query', async () => {
    const store = { query: jest.fn() }
    const subject = new StorageModel({ store })

    await subject.query()

    expect(store.query).toBeCalledWith(subject)
  })

  it('find', async () => {
    const store = { find: jest.fn() }
    const subject = new StorageModel({ store })

    await subject.find(5)

    expect(store.find).toBeCalledWith(subject, 5)
  })

  it('save', async () => {
    const store = { save: jest.fn() }
    const subject = new StorageModel({ store })

    await subject.save(4)

    expect(store.save).toBeCalledWith(subject, 4)
  })

  it('destroy', async () => {
    const store = { destroy: jest.fn() }
    const subject = new StorageModel({ store })

    await subject.destroy(3)

    expect(store.destroy).toBeCalledWith(subject, 3)
  })
})
