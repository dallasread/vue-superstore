/*

------------------------------------------------------------------------
       HasMany: One instance is related to many other instances
------------------------------------------------------------------------

new Superstore({
  project: {
    relationships: {
      project: {
        type: 'HasMany'
      }
    }
  },
  task: {}
})

*/

import Utils from '../../utils/index.js'

class HasMany {
  constructor (models, key, model, relationship) {
    this.key = key
    this.model = model
    this.foreignModel = models[relationship.foreignModel || `${Utils.singularize(key)}`]
    this.primaryKey = relationship.primaryKey || this.model.primaryKey
    this.foreignKey = relationship.foreignKey || this.model.defaultForeignKey
  }

  initializeInstance (instance) {
    const relationship = this

    Object.defineProperty(instance, relationship.key, {
      get () {
        return relationship.foreignModel.data.filter((item) => {
          return item[relationship.foreignKey] + '' === instance[relationship.primaryKey] + ''
        })
      },
      set (arr) {
        return (arr || []).map((item) => {
          item[relationship.primaryKey] = instance[relationship.foreignKey]

          return item
        })
      }
    })
  }
}

export default HasMany
