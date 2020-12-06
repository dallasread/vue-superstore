import Stores from './index.js'

describe('Stores', () => {
  it('initializes', () => {
    expect(Stores.Local).toBeDefined()
    expect(Stores.Rest).toBeDefined()
    expect(Stores.S3).toBeDefined()
    expect(Stores.S3ByInstance).toBeDefined()
  })
})
