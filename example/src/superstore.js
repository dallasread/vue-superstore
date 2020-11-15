import { computed, reactive } from 'vue'
import utils from '../../lib/utils/index.js'

function initializeModel (models, modelName, options) {
  const model = models[modelName]

  model.create = (attrs) => {
    const instance = model.build(attrs)
    instance.save()
    return instance
  }

  model.build = function (attrs) {
    const instance = {
      id: Math.random()
    }

    for (var i = options.props.length - 1; i >= 0; i--) {
      instance[options.props[i]] = attrs[options.props[i]]
    }

    for (var key in options.relationships) {
      if (options.relationships[key].type === 'hasMany') {
        instance[key] = computed(function () {
          return models[key].filter((item) => {
            return item[`${utils.singularize(modelName)}Id`] === instance.id
          })
        })
      } else if (options.relationships[key].type === 'belongsTo') {
        instance[`${key}Id`] = attrs[`${key}Id`]

        instance[key] = computed(function () {
          console.log(models[`${utils.pluralize(key)}`])
          return models[`${utils.pluralize(key)}`].find((item) => {
            return item.id === instance[`${key}Id`]
          })
        })
      }
    }

    instance.save = () => {
      model.push(instance)
    }

    return instance
  }
}

export default function (options) {
  const models = {}

  let key
  let model

  for (key in options) {
    models[key] = reactive([])
  }

  for (key in models) {
    initializeModel(models, key, options[key])
  }

  return models
}
