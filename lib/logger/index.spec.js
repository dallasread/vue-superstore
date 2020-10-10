import Logger from './index.js'

describe('Logger', () => {
  it('initializes attributes', () => {
    const subject = new Logger()

    expect(subject.debug).toEqual(false)
    expect(subject.prefix).toEqual('')
  })

  it('does not log', () => {
    console.log = jest.fn()

    const subject = new Logger()

    subject.log('test')

    expect(console.log).toBeCalledTimes(0)
  })

  it('logs if debug', () => {
    console.log = jest.fn()

    const subject = new Logger({ debug: true })

    subject.log('test')

    expect(console.log).toBeCalled()
  })

  it('prefixes with a string', () => {
    const prefix = 'PREFIX'
    const subject = new Logger({ prefix: prefix })

    expect(subject.prefixed()).toEqual(prefix)
  })

  it('prefixes with a function', () => {
    const prefix = () => { return 'PREFIX' }
    const subject = new Logger({ prefix })

    expect(subject.prefixed()).toEqual(prefix())
  })
})
