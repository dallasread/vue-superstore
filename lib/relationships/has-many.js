import { computed } from 'vue'
import utils from '../utils/index.js'

export default (superstore, model, relationship, key, instance) => {
  const modelName = relationship.modelName || utils.pluralize(key)
  const foreignKey = relationship.foreignKey || `${utils.singularize(model.name)}Id`
  const primaryKey = relationship.primaryKey || 'id'

  instance[key] = computed(function () {
    const primaryValue = instance[primaryKey] + ''

    return superstore.data[modelName].filter((item) => {
      return item[foreignKey] + '' === primaryValue
    })
  })
}
