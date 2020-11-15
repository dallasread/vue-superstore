import generateUUID from './generate-uuid.js'
import Logger from '../../logger/index.js'

export default function (superstore, model, attrs) {
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
  attrs._models = superstore.models

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
