import { createApp } from 'vue'
import Logger from '../../logger/index.js'
import Instance from './instance.js'
import uniqId from 'uniq-id'

const addProp = (props, key, attrs) => {
  if (props instanceof Array) {
    if (props.indexOf('id') === -1) {
      props.push(key)
    }
  } else {
    if (!props.id) {
      props[key] = attrs || { type: String, default: null }
    }
  }
}

const buildData = (model, attrs) => {
  attrs = attrs || {}

  if (model.props instanceof Array) {
    for (let i = 0; i < model.props.length; i++) {
      if (typeof attrs[model.props[i]] === 'undefined') {
        attrs[model.props[i]] = null
      }
    }
  } else if (typeof model.props === 'object') {
    for (const key in model.props) {
      if (typeof attrs[key] === 'undefined') {
        attrs[key] = typeof model.props[key].default !== 'undefined' ? model.props[key].default : null
      }
    }
  }

  attrs.id = attrs.id || generateUUID()

  attrs._model = model

  if (model.logger) {
    attrs.logger = new Logger({
      debug: model.logger.debug,
      logger: model.logger,
      prefix () {
        return model.name + '#' + this.id + ' ~>'
      }
    })
  }

  return attrs
}

const generateUUID = uniqId.generateUUID('xxxxyxxxxyxxxxyxxxxyxxxxyxxxxyxxxxyxxxxy', 64)

const Base = function (options) {
  options = options || {}
  options.mixins = options.mixins || []
  options.props = options.props || {}
  options.computed = options.computed || {}
  options.methods = options.methods || {}

  const model = []

  model.name = options.name

  addProp(options.props, 'id', { type: String, default () { return generateUUID() } })

  options.mixins.push(Instance(model, options))

  model.Instance = function (attrs) {
    const instance = createApp({
      mixins: options.mixins,
      data () {
        return buildData(model, attrs)
      },
      // props: options.props,
      computed: options.computed,
      methods: options.methods,
      render () {}
    }).mount(document.createElement('div'))

    instance.init()

    return instance
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

  model.create = (attrs) => {
    const item = model.build(attrs)

    item.save()

    return item
  }

  model.build = (attrs) => {
    return new model.Instance(attrs)
  }

  model._connect = (superstore, key) => {
    model.name = model.name || utils.singularize(key)
    model.superstore = superstore

    model.logger = new Logger({
      debug: superstore.logger.debug,
      logger: superstore.logger,
      prefix: this.constructor.name + ':' + key + ' ~>'
    })

    superstore.models[key] = model

    model.logger.log('connected', model)

    return model
  }

  return model
}

export default Base

// import Instance from '../../instance/index.js'
// import utils from '../../utils/index.js'

// export default function Base (options) {
//   const model = reactive([])

//   model.name = options.name
//   model.props = options.props || {}
//   model.relationships = options.relationships || {}

//   for (const key in model.relationships) {
//     if (model.relationships[key].type === 'belongsTo') {
//       model._addProp(key + 'Id')
//     }
//   }

//   return model
// }
