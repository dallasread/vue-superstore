import { computed } from 'vue'
import Model from './index.js'
import Instance from '../../instance/index.js'

const buildModel = (name, opts) => {
  const models = {}

  models[name] = new Model(computed, models, name, opts)

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

  it('build', () => {
    const subject = buildModel('projects', {
      props: ['name']
    })

    const name = 'Name'
    const instance = subject.build({ name })

    expect(instance).toBeInstanceOf(Instance)
    expect(instance.name).toBe(name)
  })

  it('create', () => {
    const subject = buildModel('projects')

    const save = jest.fn()

    subject.build = jest.fn(() => {
      return { save }
    })

    subject.create()

    expect(subject.build).toHaveBeenCalled()
    expect(save).toHaveBeenCalled()
  })

  it('query', async () => {
    const id = 72
    const subject = buildModel('projects')

    await subject.create({ id })
    await subject.create()

    expect(subject.length).toBe(2)
    expect(subject[0].id).toBe(id)
  })

  it('findById', async () => {
    const id = 442
    const subject = buildModel('projects')

    await subject.create({ id })

    expect(subject.length).toBe(1)
    expect(subject[0].id).toBe(id)
  })
})
