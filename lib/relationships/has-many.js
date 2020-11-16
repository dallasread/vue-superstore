import utils from '../utils/index.js'

export default (models, key, model, relationship, instance) => {
  const primaryKey = relationship.primaryKey || 'id'
  const foreignKey = relationship.foreignKey || `${utils.singularize(model.name)}Id`
  const arr = models[key]

  instance[key] = model.computed(() => {
    return arr.filter((item) => {
      return item[foreignKey] + '' === instance[primaryKey] + ''
    })
  })
}
