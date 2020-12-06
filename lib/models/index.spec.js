import Models from './index.js'

describe('Models', () => {
  it('initializes', () => {
    expect(Models.Base).toBeDefined()
    expect(Models.MultiStorage).toBeDefined()
    expect(Models.Storage).toBeDefined()
  })
})
