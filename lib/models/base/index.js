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

  query () {
    return new Promise((resolve) => {
      resolve(this)
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
