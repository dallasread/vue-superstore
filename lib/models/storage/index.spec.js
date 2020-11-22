import Storage from './index.js'

describe('Models:Storage', () => {
  it('requires a store', () => {
    expect(() => {
      new Storage()
    }).toThrow(new Error('`Storage.options.store` is required'))
  })

  it('query', async () => {
    const store = { query: jest.fn() }
    const subject = new Storage({ store })

    await subject.query()

    expect(store.query).toBeCalledWith(subject)
  })

  it('find', async () => {
    const store = { find: jest.fn() }
    const subject = new Storage({ store })

    await subject.find(5)

    expect(store.find).toBeCalledWith(subject, 5)
  })

  it('save', async () => {
    const store = { save: jest.fn() }
    const subject = new Storage({ store })

    await subject.save(4)

    expect(store.save).toBeCalledWith(subject, 4)
  })

  it('destroy', async () => {
    const store = { destroy: jest.fn() }
    const subject = new Storage({ store })

    await subject.destroy(3)

    expect(store.destroy).toBeCalledWith(subject, 3)
  })
})
