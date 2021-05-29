import { ref } from 'vue'

const createFunc = (_, func) => {
  return function _createFunc () {
    return func.call(_, ...arguments)
  }
}

class Instance {
  constructor (models, modelName, attrs) {
    this.model = models[modelName]

    this.applyAttrs(attrs || {})
    this.applyProps(this.model.props)
    this.applyComputed(this.model._computed, this.model.computed)
    this.applyMethods(this.model.methods)
    this.applyRelationships(this.model.relationships)

    this._updateLastSaved()

    return this
  }

  applyAttrs (attrs) {
    for (const key in attrs) {
      this[key] = attrs[key]
    }
  }

  applyProps (props) {
    for (const key in props) {
      const val = this[key] || (typeof props[key].default === 'function' ? props[key].default() : props[key].default)
      const reference = ref(val)

      Object.defineProperty(this, key, {
        get () {
          return reference.value
        },
        set (value) {
          reference.value = value

          return reference.value
        }
      })
    }
  }

  applyComputed (_computed, computed) {
    for (const key in computed) {
      this[key] = _computed(createFunc(this, computed[key]))
    }
  }

  applyMethods (methods) {
    for (const key in methods) {
      this[key] = createFunc(this, methods[key])
    }
  }

  applyRelationships (relationships) {
    for (const key in relationships) {
      relationships[key].initializeInstance(this)
    }
  }

  save () {
    return this.model.save(this)
  }

  destroy () {
    return this.model.destroy(this)
  }

  toJSON () {
    const obj = {}

    for (const key in this.model.props) {
      if (typeof this[key] === 'undefined') {
        obj[key] = this.model.props[key].default
      } else {
        obj[key] = this[key]
      }
    }

    return obj
  }

  changes () {
    const lastSave = this._lastSave ? JSON.parse(this._lastSave) : {}
    const current = this.toJSON()
    const obj = {}

    for (const key in current) {
      if (JSON.stringify(lastSave[key]) !== JSON.stringify(current[key])) {
        obj[key] = [lastSave[key], current[key]]
      }
    }

    return obj
  }

  hasChanges () {
    return !!Object.keys(this.changes()).length
  }

  _updateLastSaved (data) {
    this._lastSave = data || JSON.stringify(this.toJSON())
  }

  rollback () {
    var changes = this.changes()

    for (var key in changes) {
      this[key] = changes[key][0]
    }

    return this
  }
}

export default Instance
