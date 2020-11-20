import Local from './index.js'

describe('Stores:Local', () => {
  const model = []

  let subject

  model.name = 'model'

  beforeEach(() => {
    subject = new Local({
      name: `test-${Math.random()}`
    })
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

    model.push(task)

    await subject.save(model, task)

    await expect(subject.db.getItem(model.name)).resolves.toEqual([task.toJSON()])
  })

  it('destroy', async () => {
    subject.save = jest.fn()

    await subject.destroy(model, {})

    expect(subject.save).toBeCalled()
  })
})
