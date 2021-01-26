import Local from './index.js'

describe('Stores:Local', () => {
  const model = {
    name: 'project',
    primaryKey: 'id',
    data: []
  }

  let subject

  beforeEach(() => {
    subject = new Local({
      name: `test-${Math.random()}`
    })
  })

  it('requires a name', () => {
    expect(() => new Local()).toThrow(new Error('`Local.options.name` is required'))
  })

  it('query', async () => {
    await subject.db.setItem(model.name, [])

    await expect(subject.query(model)).resolves.toEqual([])
  })

  it('find', async () => {
    const task = { id: 5, name: 'Task #1' }

    await subject.db.setItem(model.name, [task])

    await expect(subject.find(model, task.id)).resolves.toEqual(task)
  })

  it('save', async () => {
    const task = { id: 5, name: 'Task #1', toJSON () { return { id: this.id, name: this.name } } }

    model.data.push(task)

    await subject.save(model, task)

    await expect(subject.db.getItem(model.name)).resolves.toEqual([task.toJSON()])
  })

  it('destroy', async () => {
    subject.save = jest.fn(() => Promise.resolve())

    await subject.destroy(model, {})

    expect(subject.save).toBeCalled()
  })

  it('reset', async () => {
    subject.db.setItem = jest.fn(() => Promise.resolve())

    await subject.reset(model)

    expect(subject.db.setItem).toBeCalledWith(model.name, [])
  })
})
