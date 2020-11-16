import Relationships from '../relationships/index.js'

class Instance {
  constructor (models, modelName, attrs) {
    this.model = models[modelName]

    this.applyAttrs(attrs || {})
    this.applyProps(this.model.props)
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
      this[key] = this[key] || (typeof props[key].default === 'function' ? props[key].default() : props[key].default)
    }
  }

  applyMethods (methods) {
    for (const key in methods) {
      this[key] = methods[key]
    }
  }

  applyRelationships (relationships) {
    let relationship

    for (const key in relationships) {
      relationship = relationships[key]
      Relationships[relationship.type](this.model.models, key, this.model, relationship, this)
    }
  }

  save () {
    if (this.model.indexOf(this) === -1) {
      this.model.push(this)
    }
  }

  destroy () {
    const index = this.model.indexOf(this)

    if (index !== -1) {
      this.model.splice(index, 1)
    }
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
