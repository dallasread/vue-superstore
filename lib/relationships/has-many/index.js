/*

------------------------------------------------------------------------
       HasMany: One instance is related to many other instances
------------------------------------------------------------------------

new Superstore({
  projects: {
    relationships: {
      project: {
        type: 'HasMany'
      }
    }
  },
  tasks: {}
})

*/

class HasMany {
  constructor(models, key, model, relationship) {
    this.key = key
    this.model = model
    this.foreignModel = models[key]
    this.primaryKey = relationship.primaryKey || this.model.primaryKey
    this.foreignKey = relationship.foreignKey || this.model.defaultForeignKey
  }

  initializeInstance(instance) {
    instance[this.key] = this.model._computed(() => {
      return this.foreignModel.data.filter((item) => {
        return item[this.foreignKey] + '' === instance[this.primaryKey] + ''
      })
    })
  }
}

export default HasMany
