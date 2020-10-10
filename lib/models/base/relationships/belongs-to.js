import utils from '../utils.js'

export default (superstore, model, key, options) => {
  const modelName = options.modelName || utils.pluralize(key)
  const primaryKey = options.primaryKey || `${utils.singularize(modelName)}Id`
  const foreignKey = options.foreignKey || 'id'

  model.instancePrototype.computed[key] = function _computedBelongsTo () {
    const primaryValue = this[primaryKey] + ''

    return superstore.data[modelName].find((item) => {
      return item[foreignKey] + '' === primaryValue
    })
  }
}
