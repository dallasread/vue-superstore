import Rest from './index.js'

describe('Stores:Rest', () => {
  const superstore = { logger: {} }

  it('connects', () => {
    const subject = new Rest()

    subject._connect(superstore, 'tasks')

    expect(subject._superstore).toEqual(superstore)
    expect(subject.logger.prefix).toEqual('Rest:tasks ~>')
  })
})
