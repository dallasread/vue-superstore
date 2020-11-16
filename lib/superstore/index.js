import Model from '../models/base/index.js'

export default function Superstore (reactive, computed, options) {
  const models = {}

  for (const key in options) {
    models[key] = reactive(new Model(computed, models, key, options[key]))
  }

  return models
}
