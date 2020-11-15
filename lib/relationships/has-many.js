import { computed, reactive } from 'vue'
import utils from '../utils/index.js'

export default (superstore, model, relationship, key, instance) => {
  const modelName = relationship.modelName || utils.pluralize(key)
  const foreignKey = relationship.foreignKey || `${utils.singularize(model.name)}Id`
  const primaryKey = relationship.primaryKey || 'id'
  const arr = reactive(superstore.models[modelName])

  instance[key] = computed(function () {
    const primaryValue = instance[primaryKey] + ''

    return arr.filter((item) => {
      return item[foreignKey] + '' === primaryValue
    })
  })
}
