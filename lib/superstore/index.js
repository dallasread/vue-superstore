import Stores from '../stores/index.js'
import Models from '../models/index.js'
import Logger from '../logger/index.js'
import Instance from '../instance/index.js'

class Superstore {
  constructor (options) {
    options = options || {}
    options.models = options.models || {}
    options.stores = options.stores || {}

    let key

    this.stores = {}
    this.models = {}

    this.logger = options.logger || new Logger({
      debug: options.debug || false,
      prefix: this.constructor.name + ' ~>'
    })

    this.logger.log('initializing')

    for (key in options.models) {
      this.registerModel(key, options.models[key])
    }

    for (key in options.stores) {
      this.registerStore(key, options.stores[key])
    }

    this.logger.log('initialized', this)

    return this
  }

  registerModel (key, model) {
    return model._connect(this, key)
  }

  registerStore (key, store) {
    return store._connect(this, key)
  }
}

Superstore.Models = Models
Superstore.Logger = Logger
Superstore.Stores = Stores
Superstore.Instance = Instance

export default Superstore
