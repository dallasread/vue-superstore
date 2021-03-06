import { reactive } from 'vue'
import Model from '../models/base/index.js'
import Instance from './index.js'

const buildModels = (name, opts) => {
  const models = {}

  models[name] = new Model(reactive, models, name, opts)

  return models
}

describe('Instance', () => {
  describe('toJSON', () => {
    it('returns all prop values', () => {
      const modelName = 'project'
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
      const modelName = 'project'
      const id = 1
      const models = buildModels(modelName, { props: { name: { default: name } } })
      const subject = new Instance(models, modelName, { id })

      subject.name = undefined

      expect(subject.toJSON()).toEqual({ id, name })
    })
  })

  it('applies custom computed methods', () => {
    const modelName = 'project'
    const expectedText = 'asdf'
    const models = buildModels(modelName, { computed: { text () { return expectedText } } })
    const subject = new Instance(models, modelName)

    expect(subject.text).toEqual(expectedText)
  })

  it('applies custom computed methods with correct this', () => {
    const modelName = 'project'
    const models = buildModels(modelName, { computed: { test () { return this } } })
    const subject = new Instance(models, modelName)

    expect(subject.test).toEqual(subject)
  })

  it('cannot write to a computed method', () => {
    const modelName = 'project'
    const models = buildModels(modelName, { computed: { test () { return 1 } } })
    const subject = new Instance(models, modelName)

    expect(() => {
      subject.test = 'test'
    }).toThrow()
  })

  it('applies custom computed methods that change', async () => {
    const modelName = 'project'
    const models = buildModels(modelName, {
      props: ['name'],
      computed: {
        test () {
          return this.name
        }
      }
    })
    const subject = new Instance(models, modelName)

    subject.name = 'First'
    expect(subject.test).toEqual(subject.name)

    subject.name = 'Second'
    expect(subject.test).toEqual(subject.name)
  })

  it('applies custom model methods', () => {
    const modelName = 'project'
    const expectedJSON = [5665]
    const models = buildModels(modelName, { methods: { toJSON () { return expectedJSON } } })
    const subject = new Instance(models, modelName)

    expect(subject.toJSON()).toEqual(expectedJSON)
  })

  it('applies custom model methods with arguments', () => {
    const modelName = 'project'
    const models = buildModels(modelName, { methods: { test (a) { return a } } })
    const subject = new Instance(models, modelName)

    expect(subject.test('b')).toEqual('b')
  })

  it('applies custom model methods with the correct this', () => {
    const modelName = 'project'
    const models = buildModels(modelName, { methods: { test () { return this } } })
    const subject = new Instance(models, modelName)

    expect(subject.test()).toEqual(subject)
  })

  it('applies initialized attributes', () => {
    const modelName = 'project'
    const models = buildModels(modelName)
    const name = 'Test'
    const subject = new Instance(models, modelName, { name })

    expect(subject.name).toEqual(name)
  })

  it('computes uses default prop value', () => {
    const modelName = 'project'
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
    const modelName = 'project'
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
      const modelName = 'project'
      const models = buildModels(modelName, {})
      const id = 1
      const subject = new Instance(models, modelName, { id })

      subject.save()

      expect(subject.hasChanges()).toEqual(false)
    })

    it('computes if has changes', () => {
      const modelName = 'project'
      const models = buildModels(modelName, {})
      const id = 1
      const subject = new Instance(models, modelName, { id })

      subject.save()

      subject.id = 2

      expect(subject.hasChanges()).toEqual(true)
    })
  })

  it('rolls back', async () => {
    const modelName = 'project'
    const models = buildModels(modelName, {})
    const id = 1
    const subject = new Instance(models, modelName, { id })

    subject.save()

    subject.id = 2

    expect(subject.rollback().toJSON()).toEqual({ id: 1 })
  })

  it('calls save for model', () => {
    const modelName = 'project'
    const models = buildModels(modelName)
    const subject = new Instance(models, modelName)

    subject.model.save = jest.fn()

    subject.save()

    expect(subject.model.save).toHaveBeenCalled()
  })

  it('calls destroy for model', () => {
    const modelName = 'project'
    const models = buildModels(modelName)
    const subject = new Instance(models, modelName)

    subject.model.destroy = jest.fn()

    subject.destroy()

    expect(subject.model.destroy).toHaveBeenCalled()
  })
})
