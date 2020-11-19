import Model from '../models/base/index.js'

export default function Superstore (reactive, computed, options) {
  const models = {}

  for (const key in options) {
    let model = options[key]

    if (model.constructor.name === 'Object') {
      model = new Model(computed, models, key, model)
    }

    models[key] = reactive(model)
  }

  return models
}
