import { computed } from 'vue'
import Base from './index.js'
import Instance from '../../instance/index.js'

const buildModel = (name, options) => {
  const models = {}

  models[name] = new Base(computed, models, name, options)

  return models[name]
}

describe('Models:Base', () => {
  it('requires a name', () => {
    expect(() => new Base()).toThrow(new Error('`Base.options.name` is required'))
  })

  it('computes toJSON based on props', () => {
    const subject = buildModel('projects', {
      props: ['name']
    })

    expect(subject.models).toBeDefined()
    expect(subject.name).toBeDefined()
    expect(subject.computed).toBeDefined()
    expect(subject.props).toBeDefined()
    expect(subject.props.id).toBeDefined()
    expect(subject.props.name).toBeDefined()
    expect(subject.relationships).toBeDefined()
    expect(subject.methods).toBeDefined()
  })

  it('sets the default foreign key', async () => {
    const key = 'asdf'
    const subject = buildModel('projects', { defaultForeignKey: key })

    expect(subject.defaultForeignKey).toEqual(key)
  })

  it('build', () => {
    const subject = buildModel('projects', {
      props: ['name']
    })

    const name = 'Name'
    const instance = subject.build({ name })

    expect(instance).toBeInstanceOf(Instance)
    expect(instance.name).toEqual(name)
  })

  describe('create', () => {
    it('builds and saves the instance', () => {
      const subject = buildModel('projects')

      subject.build = jest.fn()
      subject.save = jest.fn()

      subject.create()

      expect(subject.build).toHaveBeenCalled()
      expect(subject.save).toHaveBeenCalled()
    })
  })

  describe('save', () => {
    it('adds the instance to the array', async () => {
      const subject = buildModel('projects')

      await subject.save({ id: 5 })

      expect(subject.data.length).toEqual(1)
      expect(subject.data[0]).toBeInstanceOf(Instance)
    })

    it('modifies the instance in the array', async () => {
      const subject = buildModel('projects', { props: ['name'] })

      await subject.save({ id: 5, name: 'Bob' })
      await subject.save({ id: 5, name: 'John' })

      expect(subject.data.length).toEqual(1)
      expect(subject.data[0].name).toEqual('John')
    })
  })

  describe('query', () => {
    it('returns instances', async () => {
      const id = 72
      const subject = buildModel('projects')

      await subject.create({ id })
      await subject.create()

      expect(subject.data.length).toEqual(2)
      expect(subject.data[0].id).toEqual(id)
    })
  })

  describe('find', () => {
    it('uses the default primary key', async () => {
      const id = 442
      const subject = buildModel('projects')

      subject.create({ id })

      const instance = await subject.find(id)

      expect(instance.id).toEqual(id)
    })

    it('uses a custom primary key', async () => {
      const key = 433
      const subject = buildModel('projects', { primaryKey: 'key' })

      subject.create({ key })

      const instance = await subject.find(key)

      expect(instance.key).toEqual(key)
    })
  })

  describe('destroy', () => {
    it('removes the instance', async () => {
      const subject = buildModel('projects', { primaryKey: 'key' })
      const instance = subject.create()

      await subject.destroy(instance)

      expect(subject.data).toEqual([])
    })
  })

  describe('destroy', () => {
    it('empties all data', async () => {
      const subject = buildModel('projects', { primaryKey: 'key' })

      subject.create()

      await subject.reset()

      expect(subject.data).toEqual([])
    })
  })

  describe('applyChanges', () => {
    it('creates an object', () => {
      const subject = buildModel('projects', { props: ['name'] })
      const obj = { id: 5, name: 'Name' }

      subject.applyChanges(obj)

      expect(subject.data.map((i) => i.toJSON())).toEqual([obj])
      expect(subject.data.length).toEqual(1)
    })

    it('modifies an object', () => {
      const subject = buildModel('projects', { props: ['name'] })
      const obj = { id: 5, name: 'Bob' }

      subject.create({ id: 5, name: 'Name' })

      subject.applyChanges(obj)

      expect(subject.data.map((i) => i.toJSON())).toEqual([obj])
      expect(subject.data.length).toEqual(1)
    })

    it('ignores an undefined attribute', () => {
      const subject = buildModel('projects', { props: ['name'] })
      const obj = { id: 5, none: 'Bob' }
      const target = { id: 5, name: 'Name' }

      subject.create(target)

      subject.applyChanges(obj)

      expect(subject.data.map((i) => i.toJSON())).toEqual([target])
      expect(subject.data.length).toEqual(1)
    })

    it('creates an array', () => {
      const subject = buildModel('projects', { props: ['name'] })
      const obj = { id: 5, name: 'Name' }

      subject.applyChanges([obj])

      expect(subject.data.map((i) => i.toJSON())).toEqual([obj])
      expect(subject.data.length).toEqual(1)
    })

    it('modifies an array', () => {
      const subject = buildModel('projects', { props: ['name'] })
      const obj = { id: 5, name: 'Bob' }

      subject.create({ id: 5, name: 'Name' })

      subject.applyChanges([obj])

      expect(subject.data.map((i) => i.toJSON())).toEqual([obj])
      expect(subject.data.length).toEqual(1)
    })
  })
})
