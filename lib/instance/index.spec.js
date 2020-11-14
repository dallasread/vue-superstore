import Instance from './index.js'

describe('Instance', () => {
  it('computes toJSON based on props', () => {
    const subject = new Instance({
      props: ['name']
    }, {
      id: 1
    })

    subject.name = 'Test'
    subject.noName = 'Test'

    expect(subject.toJSON()).toEqual({ id: 1, name: 'Test' })
  })

  it('computes uses default prop value', () => {
    const subject = new Instance({
      props: {
        name: {
          default: 'Name'
        }
      }
    }, {
      id: 1
    })

    expect(subject.toJSON()).toEqual({ id: 1, name: 'Name' })
  })

  it('computes changes', async () => {
    const subject = new Instance({
      props: ['name'],
      methods: {
        save () {}
      }
    }, {
      id: 1
    })

    await subject.save()

    subject.id = 2

    expect(subject.changes()).toEqual({ id: [1, 2] })
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
