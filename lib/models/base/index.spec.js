import Instance from '../../instance/index.js'
import BaseModel from './index.js'

const name = 'basemodel'

describe('Models:Base', () => {
  it('initializes', () => {
    const subject = new BaseModel({ name })

    expect(subject.name).toEqual(name)
    expect(subject.length).toEqual(0)
  })

  it('_connect', () => {
    const logger = { debug: false }
    const superstore = { models: {}, data: {}, logger: logger }
    const key = 'tasks'
    const subject = new BaseModel({ name })

    subject._connect(superstore, key)

    expect(subject.superstore).toEqual(superstore)
    expect(subject.logger.prefix).toEqual('Base:tasks ~>')
    expect(subject.superstore.models[key]).toEqual(subject)
  })

  describe('crud', () => {
    let subject

    beforeEach(() => {
      const superstore = { models: {}, data: {}, logger: {} }
      subject = new BaseModel({
        name,
        props: ['name']
      })
      subject._connect(superstore, 'tasks')
    })

    it('build', () => {
      const task = { id: 5, name: 'Task' }
      const obj = subject.build(task)

      expect(obj.name).toEqual('Task')
      expect(obj._model).toEqual(subject)
      expect(obj.logger.constructor.name).toEqual('Logger')
    })

    it('query', async () => {
      const task = { id: 5 }

      subject.push(task)

      await expect(subject.query()).resolves.toHaveLength(1)
    })

    it('find', async () => {
      const task = subject.build({ id: 5, name: 'Task' })

      subject.push(task)

      await expect(subject.findById(task.id)).resolves.toEqual(task)
    })

    it('save to data', async () => {
      const task = { id: 5, name: 'Task' }
      const obj = await subject.save(task)

      expect(obj.name).toEqual(task.name)
      expect(subject.indexOf(obj)).toEqual(0)
    })

    it('save should update its last save', async () => {
      const task = subject.build({ id: 5 })

      task.updateLastSaved = jest.fn()

      await subject.save(task)

      expect(task.updateLastSaved).toBeCalled()
    })

    it('save should update its last save from instance', async () => {
      const task = subject.build({ id: 5 })

      task.updateLastSaved = jest.fn()

      await task.save()

      expect(task.updateLastSaved).toBeCalled()
    })

    it('destroy', async () => {
      const task = { id: 5, logger: { log () { } } }

      subject.push(task)

      await subject.destroy(task)

      expect(subject.length).toEqual(0)
    })
  })

  // TODO: computed
  // TODO: mixins
  // TODO: methods
  // TODO: relationships
})
