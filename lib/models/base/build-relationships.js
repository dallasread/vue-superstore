import Relationships from '../../relationships/index.js'

export default function (superstore, model) {
  let relationship

  for (const key in model.relationships) {
    relationship = model.relationships[key] || {}

    if (!Object.keys(relationship).length) {
      throw new Error(`"${model.name}.${key}" relationship has no configuration`)
    }
    model.instancePrototype.computed[key] = Relationships[relationship.type](superstore, model, relationship, key)

    model.logger.log('relationship:' + key, relationship.type)
  }

  return model.instancePrototype.computed
}
