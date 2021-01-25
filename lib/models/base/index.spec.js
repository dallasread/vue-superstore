import { reactive, computed } from 'vue'
import Base from './index.js'
import Instance from '../../instance/index.js'

const buildModel = (name, options) => {
  const models = {}

  models[name] = new Base(reactive, computed, models, name, options)

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
    it('calls build and save', async () => {
      const subject = buildModel('projects')
      const expectedInstance = { id: 5 }

      subject.save = jest.fn()
      subject.build = jest.fn()

      await subject.create(expectedInstance)

      expect(subject.save).toHaveBeenCalled()
      expect(subject.build).toHaveBeenCalled()
    })

    it('returns the instance', async () => {
      const subject = buildModel('projects')
      const expectedInstance = { id: 5 }

      const instance = await subject.create(expectedInstance)

      expect(instance).toBeInstanceOf(Instance)
    })
  })

  describe('save', () => {
    it('adds the instance to the array', async () => {
      const subject = buildModel('projects')

      await subject.save({ id: 5 })

      expect(subject.data.length).toEqual(1)
      expect(subject.data[0]).toBeInstanceOf(Instance)
    })

    it('calls the inMemory save', async () => {
      const subject = buildModel('projects')

      subject.inMemory.save = jest.fn()

      await subject.save({ id: 5 })

      expect(subject.inMemory.save).toHaveBeenCalled()
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

    it('calls the inMemory query', async () => {
      const subject = buildModel('projects')

      subject.inMemory.query = jest.fn()

      await subject.query()

      expect(subject.inMemory.query).toHaveBeenCalled()
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

    it('calls the inMemory find', async () => {
      const subject = buildModel('projects')

      subject.inMemory.find = jest.fn()

      await subject.find(442)

      expect(subject.inMemory.find).toHaveBeenCalled()
    })

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
      const instance = await subject.create()

      await subject.destroy(instance)

      expect(subject.data).toEqual([])
    })

    it('calls the inMemory destroy', async () => {
      const subject = buildModel('projects', { primaryKey: 'key' })
      const instance = subject.create()

      subject.inMemory.destroy = jest.fn()

      await subject.destroy(instance)

      expect(subject.inMemory.destroy).toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('empties all data', async () => {
      const subject = buildModel('projects')

      subject.create()

      await subject.reset()

      expect(subject.data).toEqual([])
    })

    it('calls the inMemory reset', async () => {
      const subject = buildModel('projects')

      subject.inMemory.reset = jest.fn()

      await subject.reset()

      expect(subject.inMemory.reset).toHaveBeenCalled()
    })
  })

  describe('empty', () => {
    it('returns true if no instances exist', () => {
      const subject = buildModel('projects')

      expect(subject.empty()).toEqual(true)
    })

    it('returns true if no instances exist', () => {
      const subject = buildModel('projects')

      subject.create()

      expect(subject.empty()).toEqual(false)
    })
  })
})
