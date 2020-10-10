import utils from '../utils.js'

export default (superstore, model, key, options) => {
  const modelName = options.modelName || utils.pluralize(key)
  const foreignKey = options.foreignKey || `${utils.singularize(model.name)}Id`
  const primaryKey = options.primaryKey || 'id'

  model.instancePrototype.computed[key] = function _computedHasMany () {
    const primaryValue = this[primaryKey] + ''

    return superstore.data[modelName].filter((item) => {
      return item[foreignKey] + '' === primaryValue
    })
  }
}
