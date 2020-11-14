import Relationships from '../relationships/index.js'

export default function (superstore, model, instance) {
  let rel
  let relationship
  let key

  for (key in model.relationships) {
    rel = model.relationships[key] || {}

    if (!Object.keys(rel).length) {
      throw new Error(`Relationship has no configuration: ${key}`)
    }

    relationship = Relationships[rel.type](superstore, model, key, rel)

    model.logger.log('relationship:' + key, rel.type)
  }
}
