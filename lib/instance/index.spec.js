import { computed } from 'vue'
import Model from '../models/base/index.js'
import Instance from './index.js'

const buildModels = (name, opts) => {
  const models = {}

  models[name] = new Model(computed, models, name, opts)

  return models
}

describe('Instance', () => {
  it('computes toJSON based on props', () => {
    const modelName = 'projects'
    const models = buildModels(modelName, { props: ['name'] })
    const id = 1
    const name = 'Test'
    const subject = new Instance(models, modelName, { id, name })

    subject.name = name
    subject.noName = name

    expect(subject.toJSON()).toEqual({ id: id, name: name })
  })

  it('computes uses default prop value', () => {
    const modelName = 'projects'
    const defaultName = 'Name'
    const models = buildModels(modelName, {
      props: {
        name: {
          default: defaultName
        }
      }
    })
    const id = 1
    const subject = new Instance(models, modelName, { id })

    expect(subject.toJSON()).toEqual({ id: id, name: defaultName })
  })

  it('computes changes', async () => {
    const modelName = 'projects'
    const models = buildModels(modelName, {})
    const id = 1
    const newId = 2
    const subject = new Instance(models, modelName, { id })

    await subject.save()

    subject.id = newId

    expect(subject.changes()).toEqual({ id: [id, newId] })
  })

  describe('hasChanges', () => {
    it('computes if no changes', () => {
      const modelName = 'projects'
      const models = buildModels(modelName, {})
      const id = 1
      const subject = new Instance(models, modelName, { id })

      subject.save()

      expect(subject.hasChanges()).toEqual(false)
    })

    it('computes if has changes', () => {
      const modelName = 'projects'
      const models = buildModels(modelName, {})
      const id = 1
      const subject = new Instance(models, modelName, { id })

      subject.save()

      subject.id = 2

      expect(subject.hasChanges()).toEqual(true)
    })
  })

  it('rolls back', async () => {
    const modelName = 'projects'
    const models = buildModels(modelName, {})
    const id = 1
    const subject = new Instance(models, modelName, { id })

    subject.save()

    subject.id = 2

    expect(subject.rollback().toJSON()).toEqual({ id: 1 })
  })
})
