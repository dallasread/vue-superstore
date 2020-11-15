import { computed } from 'vue'
import utils from '../utils/index.js'

export default (superstore, model, relationship, key) => {
  const modelName = relationship.modelName || utils.pluralize(key)
  const foreignKey = relationship.foreignKey || `${utils.singularize(model.name)}Id`
  const primaryKey = relationship.primaryKey || 'id'

  return function () {
    return this._models[modelName].data.filter((item) => {
      return item[foreignKey] + '' === this[primaryKey] + ''
    })
  }
}
