import Base from './index.js'

describe('Stores:Base', () => {
  const superstore = { logger: {} }

  it('connects', () => {
    const subject = new Base()

    subject._connect(superstore, 'tasks')

    expect(subject._superstore).toEqual(superstore)
  })

  it('sets a logger', () => {
    const subject = new Base()

    subject._connect(superstore, 'tasks')

    expect(subject.logger.prefix).toEqual('Base:tasks ~>')
  })
})
