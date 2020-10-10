import Instance from '../../instance/index.js'
import Base from './index.js'

describe('Models:Base', () => {
  it('initializes', () => {
    const name = 'basemodel'
    const computed = { a: 1 }
    const mixins = [1]
    const methods = { a: 1 }
    const props = { a: 1 }
    const relationships = { a: 1 }
    const subject = new Base({ name, computed, mixins, methods, props, relationships })

    expect(subject.name).toEqual(name)
    expect(subject.data).toEqual([])
    expect(subject.instancePrototype._model).toEqual(subject)
    expect(subject.instancePrototype.computed).toEqual(computed)
    expect(subject.instancePrototype.mixins).toEqual(mixins)
    expect(subject.instancePrototype.methods).toEqual(methods)
    expect(subject.instancePrototype.props).toEqual(props)
    expect(subject.instancePrototype.relationships).toEqual(relationships)
  })

  it('_connect', () => {
    const logger = { debug: false }
    const superstore = { models: {}, data: {}, logger: logger }
    const key = 'tasks'
    const subject = new Base()

    subject._connect(superstore, key)

    expect(subject._superstore).toEqual(superstore)
    expect(subject._key).toEqual(key)
    expect(subject.logger.prefix).toEqual('Base:tasks ~>')
    expect(subject.extendable.constructor.name).toEqual('Function')
    expect(subject._superstore.models[key]).toEqual(subject)
    expect(subject._superstore.data[key]).toEqual(subject.data)
  })

  describe('crud', () => {
    let subject

    beforeEach(() => {
      const superstore = { models: {}, data: {}, logger: {} }
      subject = new Base({
        props: ['name']
      })
      subject._connect(superstore, 'tasks')
    })

    it('build', () => {
      const task = { id: 5, name: 'Task' }
      const obj = subject.build(task)

      expect(obj.constructor.name).toEqual('VueComponent')
      expect(obj.toJSON()).toEqual(task)
      expect(obj.name).toEqual('Task')
      expect(obj._model).toEqual(subject)
      expect(obj.logger.constructor.name).toEqual('Logger')
    })

    it('query', async () => {
      const task = { id: 5 }

      subject.data.push(task)

      expect(subject.query()).resolves.toEqual([task])
    })

    it('find', async () => {
      const task = subject.build({ id: 5, name: 'Task' })

      subject.data.push(task)

      expect(subject.find(task.id)).resolves.toEqual(task)
    })

    it('save to data', async () => {
      const task = { id: 5, name: 'Task' }
      const obj = await subject.save(task)

      expect(obj.toJSON()).toEqual(task)
      expect(subject.data.indexOf(obj)).toEqual(0)
    })

    it('save should update its last save', () => {
      const task = subject.build({ id: 5 })

      task.updateLastSaved = jest.fn()

      task.save()

      expect(task.updateLastSaved).toBeCalled()
    })

    it('destroy', async () => {
      const task = { id: 5 }

      subject.data.push(task)

      await subject.destroy(task)

      expect(subject.data).toEqual([])
    })
  })
})
