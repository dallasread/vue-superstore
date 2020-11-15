import Relationships from '../relationships/index.js'

export default function (superstore, model, instance) {
  let relationship
  let key

  for (key in model.relationships) {
    relationship = model.relationships[key] || {}

    if (!Object.keys(relationship).length) {
      throw new Error(`"${model.name}.${key}" relationship has no configuration`)
    }

    Relationships[relationship.type](superstore, model, relationship, key, instance)

    model.logger.log('relationship:' + key, relationship.type)
  }
}
