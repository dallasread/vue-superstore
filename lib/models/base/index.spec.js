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
      const superstore = { models: {}, logger: {} }
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

    it('findById', async () => {
      const task = subject.build({ id: 5, name: 'Task' })

      subject.push(task)

      await expect(subject.findById(task.id)).resolves.toEqual(task)
    })

    it('save to data', async () => {
      const task = subject.build({ id: 5, name: 'Task' })
      const obj = await task.save(task)

      expect(obj.name).toEqual(task.name)
      expect(subject.indexOf(obj)).toEqual(0)
    })

    it('save should update its last save', async () => {
      const task = subject.build({ id: 5 })

      task.updateLastSaved = jest.fn()

      await task.save()

      expect(task.updateLastSaved).toBeCalled()
    })

    it('destroy', async () => {
      const task = await subject.create({ id: 5 })

      await task.destroy()

      expect(subject.length).toEqual(0)
    })
  })

  it('computes uses default prop value', () => {
    const superstore = { models: {}, logger: {} }
    const defaultName = 'defaultName'
    const subject = new BaseModel({
      name,
      props: {
        name: {
          default: defaultName
        }
      }
    })

    subject._connect(superstore, 'tasks')

    const id = 1
    const instance = subject.build({
      id: id
    })

    expect(instance.toJSON()).toEqual({ id: id, name: defaultName })
  })

  describe('instance', () => {
    let subject

    beforeEach(() => {
      const superstore = { models: {}, logger: {} }

      subject = new BaseModel({
        name,
        props: ['name']
      })
      subject._connect(superstore, 'tasks')
    })

    it('computes toJSON based on props', () => {
      const id = 1
      const name = 'Test'
      const instance = subject.build({
        id: id
      })

      instance.name = name
      instance.noName = name

      expect(instance.toJSON()).toEqual({ id: id, name: name })
    })

    it('computes changes', async () => {
      const id = 1
      const newId = 2
      const instance = subject.build({
        id: id
      })

      await instance.save()

      instance.id = newId

      expect(instance.changes()).toEqual({ id: [id, newId] })
    })

    describe('hasChanges', () => {
      it('computes if no changes', () => {
        const instance = subject.build({
          id: 1
        })

        instance.save()

        expect(instance.hasChanges()).toEqual(false)
      })
    })

    it('computes if changes', () => {
      const instance = subject.build({
        id: 1
      })

      instance.save()

      instance.id = 2

      expect(instance.hasChanges()).toEqual(true)
    })

    it('rolls back', () => {
      const instance = subject.build({
        id: 1
      })

      instance.id = 2

      expect(instance.rollback().toJSON()).toEqual({ id: 1 })
    })
  })
})
