import InMemory from './index.js'

const buildModel = (primaryKey) => {
  return {
    data: [],
    props: { id: true, name: true },
    primaryKey: primaryKey || 'id',
    build (data) {
      return data
    }
  }
}

describe('Models:InMemory', () => {
  it('requires a model', () => {
    expect(() => new InMemory()).toThrow(new Error('`InMemory.model` is required'))
  })

  describe('query', () => {
    it('returns instances', () => {
      const model = buildModel()
      const subject = new InMemory(model)

      subject.save({ id: 35 })
      subject.save({ id: 72 })

      const result = subject.query()

      expect(result.length).toEqual(2)
      expect(result[0].id).toEqual(35)
    })
  })

  describe('find', () => {
    it('uses the default primary key', () => {
      const model = buildModel()
      const subject = new InMemory(model)
      const expectedInstance = { id: 72 }

      model.data.push(expectedInstance)

      const instance = subject.find(72)

      expect(instance).toEqual(expectedInstance)
    })

    it('uses a custom primary key', () => {
      const model = buildModel('key')
      const subject = new InMemory(model)
      const expectedInstance = { key: 72 }

      model.data.push(expectedInstance)

      const instance = subject.find(72)

      expect(instance).toEqual(expectedInstance)
    })
  })

  describe('save', () => {
    it('adds the instance to the array', () => {
      const model = buildModel()
      const subject = new InMemory(model)
      const expectedInstance = { id: 5 }

      subject.save(expectedInstance)

      expect(model.data.length).toEqual(1)
      expect(model.data[0]).toEqual(expectedInstance)
    })

    it('modifies the instance in the array', () => {
      const model = buildModel()
      const subject = new InMemory(model)

      subject.save({ id: 5, name: 'Bob' })
      subject.save({ id: 5, name: 'John' })

      expect(model.data.length).toEqual(1)
      expect(model.data[0].name).toEqual('John')
    })
  })

  describe('create', () => {
    it('returns the instance', () => {
      const model = buildModel()
      const subject = new InMemory(model)
      const expectedInstance = { id: 1 }

      subject.create(expectedInstance)

      expect(model.data.length).toEqual(1)
      expect(model.data[0]).toEqual(expectedInstance)
    })

    it('calls build and save', () => {
      const model = buildModel()
      const subject = new InMemory(model)

      model.build = jest.fn()
      subject.save = jest.fn()

      subject.create({ id: 6 })

      expect(subject.save).toHaveBeenCalled()
      expect(model.build).toHaveBeenCalled()
    })
  })

  describe('destroy', () => {
    it('removes the instance', () => {
      const model = buildModel()
      const subject = new InMemory(model)
      const instance = subject.save()

      subject.destroy(instance)

      expect(model.data).toEqual([])
    })

    it('does nothing for a nonexistent item', () => {
      const model = buildModel()
      const subject = new InMemory(model)

      subject.destroy({})

      expect(model.data).toEqual([])
    })
  })

  describe('reset', () => {
    it('empties all data', () => {
      const model = buildModel()
      const subject = new InMemory(model)

      subject.save()

      subject.reset()

      expect(model.data).toEqual([])
    })
  })

  describe('_applyChanges', () => {
    it('creates an object', () => {
      const model = buildModel()
      const subject = new InMemory(model)
      const obj = { id: 5, name: 'Name' }

      subject._applyChanges(obj)

      expect(model.data).toEqual([obj])
      expect(model.data.length).toEqual(1)
    })

    it('modifies an object with a default primaryKey', () => {
      const model = buildModel()
      const subject = new InMemory(model)
      const obj = { id: 5, name: 'Bob' }

      subject.save({ id: 5, name: 'Name' })

      subject._applyChanges(obj)

      expect(model.data).toEqual([obj])
      expect(model.data.length).toEqual(1)
    })

    it('modifies an object with a custom primaryKey', () => {
      const model = buildModel('key')
      const subject = new InMemory(model)
      const obj = { key: 5, name: 'Bob' }

      subject.save({ key: 5, name: 'Name' })

      subject._applyChanges(obj)

      expect(model.data).toEqual([obj])
      expect(model.data.length).toEqual(1)
    })

    it('creates an array', () => {
      const model = buildModel()
      const subject = new InMemory(model)
      const obj = { id: 5, name: 'Name' }

      subject._applyChanges([obj])

      expect(model.data).toEqual([obj])
      expect(model.data.length).toEqual(1)
    })

    it('modifies an array', () => {
      const model = buildModel()
      const subject = new InMemory(model)
      const obj = { id: 5, name: 'Bob' }

      subject.save({ id: 5, name: 'Name' })

      subject._applyChanges([obj])

      expect(model.data).toEqual([obj])
      expect(model.data.length).toEqual(1)
    })
  })
})
