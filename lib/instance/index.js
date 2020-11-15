// import { toRefs, reactive } from 'vue'
import uniqId from 'uniq-id'
import Logger from '../logger/index.js'
import buildRelationships from './build-relationships.js'

var generateUUID = uniqId.generateUUID('xxxxyxxxxyxxxxyxxxxyxxxxyxxxxyxxxxyxxxxy', 64)

export default function (model, instance) {
  model = model || {}

  instance = instance || {}

  if (model.props instanceof Array) {
    for (let i = 0; i < model.props.length; i++) {
      if (typeof instance[model.props[i]] === 'undefined') {
        instance[model.props[i]] = null
      }
    }
  } else if (typeof model.props === 'object') {
    for (const key in model.props) {
      if (typeof instance[key] === 'undefined') {
        instance[key] = typeof model.props[key].default !== 'undefined' ? model.props[key].default : null
      }
    }
  }

  instance.id = instance.id || generateUUID()

  instance._model = model

  if (model.logger) {
    instance.logger = new Logger({
      debug: model.logger.debug,
      logger: model.logger,
      prefix () {
        return model.name + '#' + this.id + ' ~>'
      }
    })
  }

  instance.toJSON = () => {
    const obj = { id: instance.id }

    if (model.props instanceof Array) {
      for (let i = 0; i < model.props.length; i++) {
        obj[model.props[i]] = instance[model.props[i]]
      }
    } else if (typeof model.props === 'object') {
      for (const key in model.props) {
        if (typeof instance[key] === 'undefined') {
          obj[key] = model.props[key].default
        } else {
          obj[key] = instance[key]
        }
      }
    }

    return obj
  }

  instance.save = () => {
    if (typeof model.save !== 'function') {
      throw new Error('`Model.save` is not implemented')
    }

    return model.save(instance)
  }

  instance.destroy = () => {
    if (typeof model.destroy !== 'function') {
      throw new Error('`Model.destroy` is not implemented')
    }

    return model.destroy(...arguments)
  }

  instance.changes = () => {
    const lastSave = instance._lastSave ? JSON.parse(instance._lastSave) : {}
    const current = instance.toJSON()
    const obj = {}

    for (const key in current) {
      if (JSON.stringify(lastSave[key]) !== JSON.stringify(current[key])) {
        obj[key] = [lastSave[key], current[key]]
      }
    }

    return obj
  }

  instance.updateLastSaved = (data) => {
    instance._lastSave = data || JSON.stringify(instance.toJSON())
  }

  instance.rollback = () => {
    var changes = instance.changes()

    for (var key in changes) {
      instance[key] = changes[key][0]
    }

    return instance
  }

  instance.init = () => {
    instance.updateLastSaved()
  }

  instance.hasChanges = () => {
    return !!Object.keys(instance.changes()).length
  }

  buildRelationships(model.superstore, model, instance)

  instance.init()

  return instance
}
