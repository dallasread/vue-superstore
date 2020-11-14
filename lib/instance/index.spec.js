import Instance from './index.js'

describe('Instance', () => {
  it('computes toJSON based on props', () => {
    const id = 1
    const name = 'Test'
    const subject = new Instance({
      props: ['name']
    }, {
      id: id
    })

    subject.name = name
    subject.noName = name

    expect(subject.toJSON()).toEqual({ id: id, name: name })
  })

  it('computes uses default prop value', () => {
    const id = 1
    const defaultName = 'Name'
    const subject = new Instance({
      props: {
        name: {
          default: defaultName
        }
      }
    }, {
      id: id
    })

    expect(subject.toJSON()).toEqual({ id: id, name: defaultName })
  })

  it('computes changes', async () => {
    const id = 1
    const newId = 2
    const subject = new Instance({
      props: ['name'],
      methods: {
        save () {}
      }
    }, {
      id: id
    })

    await subject.save()

    subject.id = newId

    expect(subject.changes()).toEqual({ id: [id, newId] })
  })

  describe('hasChanges', () => {
    it('computes if no changes', () => {
      const subject = new Instance({
        methods: {
          save () {}
        }
      }, {
        id: 1
      })

      subject.save()

      expect(subject.hasChanges()).toEqual(false)
    })
  })

  it('computes if changes', () => {
    const subject = new Instance({
      methods: {
        save () {}
      }
    }, {
      id: 1
    })

    subject.save()

    subject.id = 2

    expect(subject.hasChanges()).toEqual(true)
  })

  it('uses the model to save', () => {
    const model = {
      methods: {
        save: jest.fn(() => {
          return Promise.resolve()
        })
      }
    }
    const subject = new Instance(model, {
      id: 1
    })

    subject.save()

    expect(model.methods.save).toBeCalled()
  })

  it('uses the model to destroy', () => {
    const model = {
      methods: {
        destroy: jest.fn(() => {
          return Promise.resolve()
        })
      }
    }
    const subject = new Instance(model, {
      id: 1
    })

    subject.destroy()

    expect(model.methods.destroy).toBeCalled()
  })

  it('rolls back', async () => {
    const subject = new Instance({}, {
      id: 1
    })

    subject.id = 2

    expect(subject.rollback().toJSON()).toEqual({ id: 1 })
  })
})
