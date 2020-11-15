import { ref, computed } from 'vue'
import utils from '../utils/index.js'

export default (superstore, model, relationship, key, instance) => {
  const modelName = relationship.modelName || utils.pluralize(key)
  const primaryKey = relationship.primaryKey || `${utils.singularize(modelName)}Id`
  const foreignKey = relationship.foreignKey || 'id'

  instance[key] = computed(() => {
    return superstore.data[modelName].find((item) => {
      return item[foreignKey] + '' === instance[primaryKey] + ''
    })
  })
}
