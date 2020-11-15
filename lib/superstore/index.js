import utils from '../../lib/utils/index.js'
import generateUUID from '../../lib/models/base/generate-uuid.js'

function arrToObj (props) {
  if (props instanceof Array) {
    const obj = {}

    for (var i = props.length - 1; i >= 0; i--) {
      obj[props[i]] = null
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
    instance.save = () => {
      if (model.indexOf(instance) === -1) {
        model.push(instance)
      }
    }

    instance.destroy = () => {
      const index = model.indexOf(instance)

      if (index !== -1) {
        model.splice(index, 1)
      }
    }
  }

  model.build = function (attrs) {
    attrs = attrs || {}

    const instance = {}

    model._buildProps(instance, attrs)
    model._buildRelationships(instance, attrs)
    model._buildMethods(instance)

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
