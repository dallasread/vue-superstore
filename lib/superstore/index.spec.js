import Superstore from './index.js'

describe('Superstore', () => {
  it('initializes logger', () => {
    const subject = new Superstore()

    expect(subject.logger.constructor.name).toEqual('Logger')
  })

  it('initializes data', () => {
    const subject = new Superstore()

    expect(subject.data).toEqual({})
  })

  it('registers stores', () => {
    const subject = new Superstore({ stores: { local: { _connect () { } } } })

    expect(Object.keys(subject.stores).length).toEqual(1)
  })

  it('registers models', () => {
    const model = { _connect () { } }
    const subject = new Superstore({ models: { tasks: model } })

    expect(subject.data.tasks).toEqual(model)
  })

  it('prefixes logs', () => {
    console.log = jest.fn()

    const subject = new Superstore({ debug: true })

    subject.logger.log('test')

    expect(console.log).toBeCalledWith('Superstore ~>', 'test')
  })
})
