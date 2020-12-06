import { computed } from 'vue'
import Model from '../models/base/index.js'
import Instance from './index.js'

const buildModels = (name, opts) => {
  const models = {}

  models[name] = new Model(computed, models, name, opts)

  return models
}

describe('Instance', () => {
  describe('toJSON', () => {
    it('returns all prop values', () => {
      const modelName = 'projects'
      const models = buildModels(modelName, { props: ['name'] })
      const id = 1
      const name = 'Test'
      const subject = new Instance(models, modelName, { id, name })

      subject.name = name
      subject.noName = name

      expect(subject.toJSON()).toEqual({ id: id, name: name })
    })

    it('returns default prop values', () => {
      const name = 'Default'
      const modelName = 'projects'
      const id = 1
      const models = buildModels(modelName, { props: { name: { default: name } } })
      const subject = new Instance(models, modelName, { id })

      subject.name = undefined

      expect(subject.toJSON()).toEqual({ id, name })
    })
  })

  it('applies custom computed methods', () => {
    const modelName = 'projects'
    const expectedText = 'asdf'
    const models = buildModels(modelName, { computed: { text () { return expectedText } } })
    const subject = new Instance(models, modelName)

    expect(subject.text.value).toEqual(expectedText)
  })

  it('applies custom model methods', () => {
    const modelName = 'projects'
    const expectedJSON = [5665]
    const models = buildModels(modelName, { methods: { toJSON () { return expectedJSON } } })
    const subject = new Instance(models, modelName)

    expect(subject.toJSON()).toEqual(expectedJSON)
  })

  it('applies initialized attributes', () => {
    const modelName = 'projects'
    const models = buildModels(modelName)
    const name = 'Test'
    const subject = new Instance(models, modelName, { name })

    expect(subject.name).toEqual(name)
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

  it('calls save for model', () => {
    const modelName = 'projects'
    const models = buildModels(modelName)
    const subject = new Instance(models, modelName)

    subject.model.save = jest.fn()

    subject.save()

    expect(subject.model.save).toHaveBeenCalled()
  })

  it('calls destroy for model', () => {
    const modelName = 'projects'
    const models = buildModels(modelName)
    const subject = new Instance(models, modelName)

    subject.model.destroy = jest.fn()

    subject.destroy()

    expect(subject.model.destroy).toHaveBeenCalled()
  })
})
