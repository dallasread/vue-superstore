import { computed } from 'vue'
import utils from '../utils/index.js'

export default (superstore, model, relationship, key, instance) => {
  const modelName = relationship.modelName || utils.pluralize(key)
  const primaryKey = relationship.primaryKey || `${utils.singularize(modelName)}Id`
  const foreignKey = relationship.foreignKey || 'id'

  instance[key] = computed(() => {
    const primaryValue = instance[primaryKey] + ''

    return Array.prototype.find.call(superstore.data[modelName], (item) => {
      return item[foreignKey] + '' === primaryValue
    })
  })
}
