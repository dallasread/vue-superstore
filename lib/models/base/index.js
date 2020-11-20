import utils from '../../utils/index.js'
import Instance from '../../instance/index.js'

class Model extends Array {
  constructor (computed, models, name, options) {
    super()

    options = options || {}

    this.models = models
    this.name = name
    this.computed = computed
    this.props = utils.arrToObj(options.props || {})
    this.props.id = this.props.id || { type: String, default () { return utils.uuid() } }
    this.relationships = utils.arrToObj(options.relationships || {})
    this.methods = options.methods || {}

    return this
  }

  build (attrs) {
    return new Instance(this.models, this.name, attrs)
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

  query () {
    return new Promise((resolve) => {
      resolve(this)
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

  findById (id) {
    id += ''

    return new Promise((resolve) => {
      resolve(this.find((item) => {
        return item.id + '' === id
      }))
    })
  }
}

export default Model
