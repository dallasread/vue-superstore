import { reactive } from 'vue'
import Instance from '../../instance/index.js'
import Logger from '../../logger/index.js'
import utils from '../../utils/index.js'

export default function Base (options) {
  const model = reactive([])

  options = options || {}
  options.methods = options.methods || {}

  model.name = options.name
  model.props = options.props || {}
  model.relationships = options.relationships || {}

  model.save = options.methods.save || function (item) {
    return new Promise((resolve) => {
      if (typeof item.changes !== 'function') {
        item = model.build(item)
      }

      var changes = item.changes()

      item.updateLastSaved()

      if (model.indexOf(item) === -1) {
        model.push(item)
      }

      item.logger.log('saved', changes)

      resolve(item)
    })
  }

  model.query = options.methods.query || function () {
    return new Promise((resolve) => {
      resolve(model)
    })
  }

  model.findById = options.methods.findById || function (id) {
    id += ''

    return new Promise((resolve) => {
      resolve(model.find((item) => {
        return item.id + '' === id
      }))
    })
  }

  model.destroy = options.methods.destroy || function (item) {
    return new Promise((resolve) => {
      console.log(model.indexOf(item))
      model.splice(model.indexOf(item), 1)

      item.logger.log('destroyed')

      resolve(item)
    })
  }

  model.create = (attrs) => {
    const item = model.build(attrs)

    item.save()

    return item
  }

  model.build = (attrs) => {
    return new Instance(model, attrs)
  }

  model._connect = (superstore, key) => {
    model.name = model.name || utils.singularize(key)
    model.superstore = superstore

    model.logger = new Logger({
      debug: superstore.logger.debug,
      logger: superstore.logger,
      prefix: this.constructor.name + ':' + key + ' ~>'
    })

    superstore.data[key] = model

    model.logger.log('connected', model)

    return model
  }

  model._addProp = (key) => {
    if (model.props instanceof Array) {
      model.props.push(key)
    } else {
      model.props[key] = { type: String, default: null }
    }
  }

  for (const key in model.relationships) {
    if (model.relationships[key].type === 'belongsTo') {
      model._addProp(key + 'Id')
    }
  }

  return model
}
