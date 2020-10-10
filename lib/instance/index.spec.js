import Vue from 'vue'
import Instance from './index.js'

describe('Instance', () => {
  const mount = (attrs) => {
    const instance = new Instance()

    for (const key in attrs) {
      instance[key] = attrs[key]
    }

    return instance
  }

  const _model = {
    name: 'test',
    instancePrototype: {
      props: ['name']
    },
    save: jest.fn(() => {
      return Promise.resolve()
    }),
    destroy: jest.fn(() => {
      return Promise.resolve()
    })
  }

  it('computes logId', () => {
    const subject = mount({ _model, id: 1 })

    expect(subject._logId).toEqual('test#1')
  })

  it('computes toJSON', () => {
    const subject = mount({ _model, id: 1 })

    subject.name = 'Test'

    expect(subject.toJSON()).toEqual({ id: 1, name: 'Test' })
  })

  it('computes changes', async () => {
    const subject = mount({ _model, id: 1 })

    await subject.save()

    subject.id = 2

    expect(subject.changes()).toEqual({ id: [1, 2] })
  })

  describe('hasChanges', () => {
    it('computes if no changes', () => {
      const subject = mount({ _model })

      subject.save()

      expect(subject.hasChanges()).toEqual(false)
    })

    it('computes if changes', () => {
      const subject = mount({ _model })

      subject.save()

      subject.id = 1

      expect(subject.hasChanges()).toEqual(true)
    })
  })

  it('uses the model to save', () => {
    const subject = mount({ _model })

    subject.save()

    expect(subject._model.save).toBeCalled()
  })

  it('uses the model to destroy', () => {
    const subject = mount({ _model })

    subject.destroy()

    expect(subject._model.destroy).toBeCalled()
  })

  it('rolls back', async () => {
    const subject = mount({ _model, id: 1 })

    await subject.save()

    subject.id = 2

    expect(subject.rollback().toJSON()).toEqual({ id: 1 })
  })
})
