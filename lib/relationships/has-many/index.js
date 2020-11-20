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

import utils from '../../utils/index.js'

const HasMany = (models, key, model, relationship, instance) => {
  const foreignModel = models[key]
  const primaryKey = relationship.primaryKey || model.primaryKey
  const foreignKey = relationship.foreignKey || model.defaultForeignKey

  instance[key] = model._computed(() => {
    return foreignModel.filter((item) => {
      return item[foreignKey] + '' === instance[primaryKey] + ''
    })
  })
}

export default HasMany
