import Relationships from './index.js'

describe('Relationships', () => {
  it('initializes', () => {
    expect(Relationships.BelongsTo).toBeDefined()
    expect(Relationships.HasMany).toBeDefined()
  })
})
