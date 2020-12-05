/*

------------------------------------------------------------------------
             BelongsTo: One instance is related to another
------------------------------------------------------------------------

new Superstore({
  projects: {},
  tasks: {
    relationships: {
      project: {
        type: 'BelongsTo'
      }
    }
  }
})

*/

import utils from '../../utils/index.js'

const BelongsTo = (models, key, model, relationship, instance) => {
  const foreignModel = models[`${utils.pluralize(key)}`]
  const primaryKey = relationship.primaryKey || foreignModel.defaultForeignKey
  const foreignKey = relationship.foreignKey || foreignModel.primaryKey

  model.props[primaryKey] = model.props[primaryKey] || {}
  instance[primaryKey] = instance[primaryKey] || null

  instance[key] = model._computed(() => {
    return foreignModel.data.find((item) => {
      return item[foreignKey] + '' === instance[primaryKey] + ''
    })
  })
}

export default BelongsTo
