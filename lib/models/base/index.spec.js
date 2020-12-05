import { computed } from 'vue'
import Model from './index.js'
import Instance from '../../instance/index.js'

const buildModel = (name, options) => {
  const models = {}

  models[name] = new Model(computed, models, name, options)

  return models[name]
}

describe('Models:Base', () => {
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

    expect(subject.defaultForeignKey).toBe(key)
  })

  it('build', () => {
    const subject = buildModel('projects', {
      props: ['name']
    })

    const name = 'Name'
    const instance = subject.build({ name })

    expect(instance).toBeInstanceOf(Instance)
    expect(instance.name).toBe(name)
  })

  it('create', async () => {
    const subject = buildModel('projects')

    subject.build = jest.fn()
    subject.save = jest.fn()

    subject.create()

    expect(subject.build).toHaveBeenCalled()
    expect(subject.save).toHaveBeenCalled()
  })

  it('query', async () => {
    const id = 72
    const subject = buildModel('projects')

    await subject.create({ id })
    await subject.create()

    expect(subject.data.length).toBe(2)
    expect(subject.data[0].id).toBe(id)
  })

  describe('find', () => {
    it('uses the default primary key', async () => {
      const id = 442
      const subject = buildModel('projects')

      subject.create({ id })

      const instance = await subject.find(id)

      expect(instance.id).toBe(id)
    })

    it('uses a custom primary key', async () => {
      const key = 433
      const subject = buildModel('projects', { primaryKey: 'key' })

      subject.create({ key })

      const instance = await subject.find(key)

      expect(instance.key).toBe(key)
    })
  })
})
