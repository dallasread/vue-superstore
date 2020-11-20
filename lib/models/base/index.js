import utils from '../../utils/index.js'
import Instance from '../../instance/index.js'

class Base extends Array {
  constructor (computed, models, name, options) {
    super()

    options = options || {}

    this.primaryKey = options.primaryKey || 'id'
    this.models = models
    this.name = name
    this._computed = computed
    this.props = utils.arrToObj(options.props || {})
    this.props[this.primaryKey] = this.props[this.primaryKey] || { type: String, default () { return utils.uuid() } }
    this.relationships = utils.arrToObj(options.relationships || {})
    this.methods = options.methods || {}
    this.computed = options.computed || {}
    this.defaultForeignKey = options.defaultForeignKey || `${utils.singularize(this.name)}${utils.capitalize(this.primaryKey)}`

    return this
  }

  build (attrs) {
    return new Instance(this.models, this.name, attrs)
  }

  query () {
    return new Promise((resolve) => {
      resolve(this)
    })
  }

  find (id) {
    id += ''

    return new Promise((resolve) => {
      resolve(this.filter((item) => {
        return item[this.primaryKey] + '' === id
      })[0])
    })
  }

  create (attrs) {
    const instance = this.build(attrs)
    instance.save()
    return instance
  }

  save (instance) {
    if (this.indexOf(instance) === -1) {
      this.push(instance)
    }

    return new Promise((resolve) => {
      resolve(instance)
    })
  }

  destroy (instance) {
    const index = this.indexOf(instance)

    if (index !== -1) {
      this.splice(index, 1)
    }

    return new Promise((resolve) => {
      resolve()
    })
  }
}

export default Base
