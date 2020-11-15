import utils from '../utils/index.js'

export default (superstore, model, relationship, key) => {
  const modelName = relationship.modelName || utils.pluralize(key)
  const primaryKey = relationship.primaryKey || `${utils.singularize(modelName)}Id`
  const foreignKey = relationship.foreignKey || 'id'

  return function () {
    return this._models[modelName].data.find((item) => {
      return item[foreignKey] + '' === this[primaryKey] + ''
    })
  }
}
