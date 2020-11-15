import utils from '../../lib/utils/index.js'
import generateUUID from '../../lib/models/base/generate-uuid.js'

function arrToObj (props) {
  if (props instanceof Array) {
    const obj = {}

    for (var i = props.length - 1; i >= 0; i--) {
      obj[props[i]] = {}
    }

    return obj
  } else {
    return props
  }
}

function initializeModel (computed, models, modelName, options) {
  const model = models[modelName]
  const props = arrToObj(options.props || {})
  const relationships = arrToObj(options.relationships || {})
  const methods = options.methods || {}

  model.create = (attrs) => {
    const instance = model.build(attrs)
    instance.save()
    return instance
  }

  model._buildProps = (instance, attrs) => {
    instance.id = attrs.id || generateUUID()

    for (var key in props) {
      instance[key] = attrs[key] || props[key].default
    }

    return instance
  }

  model._buildRelationships = (instance, attrs) => {
    for (var key in relationships) {
      if (relationships[key].type === 'hasMany') {
        instance[key] = computed(function () {
          return models[key].filter((item) => {
            return item[`${utils.singularize(modelName)}Id`] + '' === instance.id + ''
          })
        })
      } else if (relationships[key].type === 'belongsTo') {
        instance[`${key}Id`] = attrs[`${key}Id`]

        instance[key] = computed(function () {
          return models[`${utils.pluralize(key)}`].find((item) => {
            return item.id + '' === instance[`${key}Id`] + ''
          })
        })
      }
    }
  }

  model._buildMethods = (instance) => {
    instance.save = instance.save || function () {
      if (model.indexOf(instance) === -1) {
        model.push(instance)
      }
    }

    instance.destroy = instance.destroy || function () {
      const index = model.indexOf(instance)

      if (index !== -1) {
        model.splice(index, 1)
      }
    }
  }

  model._buildOptionsMethods = (instance, methods) => {
    for (const key in methods) {
      instance[key] = methods[key]
    }
  }

  model.build = function (attrs) {
    attrs = attrs || {}

    const instance = {}

    model._buildProps(instance, attrs)
    model._buildOptionsMethods(instance, methods)
    model._buildMethods(instance, methods)
    model._buildRelationships(instance, attrs)

    return instance
  }
}

export default function Superstore (reactive, computed, options) {
  const models = {}

  let key
  let model

  for (key in options) {
    models[key] = reactive([])
  }

  for (key in models) {
    initializeModel(computed, models, key, options[key])
  }

  return models
}
