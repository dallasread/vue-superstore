import utils from '../utils/index.js'

export default (models, key, model, relationship, instance) => {
  const primaryKey = relationship.primaryKey || `${key}Id`
  const foreignKey = relationship.foreignKey || 'id'
  const _modelName = `${utils.pluralize(key)}`
  const arr = models[_modelName]

  instance[primaryKey] = instance[primaryKey] || null

  instance[key] = model.computed(() => {
    return arr.find((item) => {
      return item[foreignKey] + '' === instance[primaryKey] + ''
    })
  })
}
