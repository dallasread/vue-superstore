import Local from './index.js'

describe('Stores:Local', () => {
  const model = { _key: 'tasks', data: [], logger: { log () {} } }
  let subject

  beforeEach(() => {
    subject = new Local({
      name: `test-${Math.random()}`
    })
  })

  it('connects', () => {
    const superstore = { logger: {} }

    subject._connect(superstore, model._key)

    expect(subject._superstore).toEqual(superstore)
    expect(subject.logger.prefix).toEqual('Local:tasks ~>')
  })

  it('query', async () => {
    await subject.db.setItem(model._key, [])

    await expect(subject.query(model)).resolves.toEqual([])
  })

  it('find', async () => {
    const task = { id: 5, name: 'Task #1' }

    await subject.db.setItem(model._key, [task])

    await expect(subject.find(model, task.id)).resolves.toEqual(task)
  })

  it('save', async () => {
    const task = { id: 5, name: 'Task #1', toJSON () { return { id: this.id, name: this.name } } }

    model.data.push(task)

    await subject.save(model, task)

    await expect(subject.db.getItem(model._key)).resolves.toEqual([task.toJSON()])
  })

  it('destroy', async () => {
    subject.save = jest.fn()

    await subject.destroy(model, {})

    expect(subject.save).toBeCalled()
  })
})
