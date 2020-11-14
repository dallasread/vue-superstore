import { reactive } from 'vue'

export default function (model, attrs) {
  let instance

  model.methods = model.methods || {}

  attrs = attrs || {}

  attrs.toJSON = () => {
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

  attrs.save = () => {
    if (typeof model.methods.save !== 'function') {
      throw new Error('`Model.methods.save` is not implemented')
    }

    return model.methods.save(...arguments)
  }

  attrs.destroy = () => {
    if (typeof model.methods.destroy !== 'function') {
      throw new Error('`Model.methods.destroy` is not implemented')
    }

    return model.methods.destroy(...arguments)
  }

  attrs.changes = () => {
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

  attrs.updateLastSaved = (data) => {
    instance._lastSave = data || JSON.stringify(instance.toJSON())
  }

  attrs.rollback = () => {
    var changes = instance.changes()

    for (var key in changes) {
      instance[key] = changes[key][0]
    }

    return instance
  }

  attrs.init = () => {
    instance.updateLastSaved()
  }

  attrs.hasChanges = () => {
    return !!Object.keys(instance.changes()).length
  }

  // type: Vue.ref('wow'),
  // things: Vue.ref([{ name: 'Yup', wow: true }, { name: 'Nop', wow: false }, { name: 'Now', now: true }]),
  // items: Vue.computed(() => {
  //   return instance.things.filter(
  //     thing => thing[instance.type]
  //   )
  // }),

  instance = reactive(attrs)
  instance.init()

  return instance
}
