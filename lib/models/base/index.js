import { createApp, reactive } from 'vue'
import Instance from '../../instance/index.js'
import Relationships from '../../relationships/index.js'
import Logger from '../../logger/index.js'
import utils from '../../utils/index.js'

export default function Base (options) {
  let data = []

  options = options || {}
  options.props = options.props || {}
  options.methods = options.methods || {}

  if (typeof options.name === 'undefined') {
    throw new Error('No `Model.options.name` supplied')
  }

  data.name = options.name

  data.save = options.methods.save || function (item) {
    return new Promise((resolve) => {
      if (typeof item.changes !== 'function') {
        item = data.build(item)
      }

      var changes = item.changes()

      item.updateLastSaved()

      if (data.indexOf(item) === -1) {
        data.push(item)
      }

      item.logger.log('saved', changes)

      resolve(item)
    })
  }

  data.query = options.methods.query || function () {
    return new Promise((resolve) => {
      resolve(data)
    })
  }

  data.find = options.methods.find || function (id) {
    id += ''

    return new Promise((resolve) => {
      resolve(Array.prototype.find.call(data, (item) => {
        return item.id + '' === id
      }))
    })
  }

  data.destroy = options.methods.destroy || function (item) {
    return new Promise((resolve) => {
      data.splice(data.indexOf(item), 1)

      item.logger.log('destroyed')

      resolve(item)
    })
  }

  data.create = (attrs) => {
    const item = data.build(attrs)

    item.save()

    return item
  }

  data.build = (attrs) => {
    return new Instance(data, attrs)
  }

  data._connect = (superstore, key) => {
    // data.name = data.name || utils.singularize(key)
    data._superstore = superstore

    data.logger = new Logger({
      debug: superstore.logger.debug,
      logger: superstore.logger,
      prefix: this.constructor.name + ':' + key + ' ~>'
    })

    // data._buildRelationships(superstore, data.instancePrototype.relationships)

    superstore.models[key] = data

    data.logger.log('connected', data)

    return data
  }

  data = reactive(data)

  return data
}

//   _buildRelationships (superstore, relationships) {
//     let rel
//     let relationship
//     let key

//     for (key in relationships) {
//       rel = relationships[key] || {}

//       if (!Object.keys(rel).length) {
//         throw new Error(`Relationship has no configuration: ${key}`)
//       }

//       relationship = Relationships[rel.type](superstore, this, key, rel)

//       this.logger.log('relationship:' + key, rel.type)
//     }
//   }
// }
