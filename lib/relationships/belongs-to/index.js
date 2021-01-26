/*

------------------------------------------------------------------------
             BelongsTo: One instance is related to another
------------------------------------------------------------------------

new Superstore({
  project: {},
  task: {
    relationships: {
      project: {
        type: 'BelongsTo'
      }
    }
  }
})

*/

import Utils from '../../utils/index.js'

class BelongsTo {
  constructor (models, key, model, relationship) {
    this.key = key
    this.model = model
    this.foreignModel = models[relationship.foreignModel || `${Utils.singularize(key)}`]
    this.primaryKey = relationship.primaryKey || this.foreignModel.defaultForeignKey
    this.foreignKey = relationship.foreignKey || this.foreignModel.primaryKey
    this.model.props[this.primaryKey] = this.model.props[this.primaryKey] || {}
  }

  initializeInstance (instance) {
    instance[this.primaryKey] = instance[this.primaryKey] || null

    instance[this.key] = this.model._computed(() => {
      return this.foreignModel.data.find((item) => {
        return item[this.foreignKey] + '' === instance[this.primaryKey] + ''
      })
    })
  }
}

export default BelongsTo
