import Logger from '../../logger'
import Instance from '../../instance'
import Relationships from '../../relationships/index.js'
import uniqId from 'uniq-id'
import utils from '../../utils/index.js'

var generateUUID = uniqId.generateUUID('xxxxyxxxxyxxxxyxxxxyxxxxyxxxxyxxxxyxxxxy', 64)

class Base {
  constructor (options) {
    options = options || {}

    this.name = options.name
    this.data = []

    this.instancePrototype = {
      _model: this,
      computed: options.computed || {},
      mixins: options.mixins || [],
      methods: options.methods || {},
      props: options.props || {},
      relationships: options.relationships || {}
    }
  }

  _connect (superstore, key) {
    this.name = this.name || utils.singularize(key)

    Object.defineProperty(this, '_superstore', {
      value: superstore,
      enumerable: false,
      writable: false
    })

    Object.defineProperty(this, '_key', {
      value: key,
      enumerable: false,
      writable: false
    })

    this.logger = new Logger({
      debug: superstore.logger.debug,
      logger: superstore.logger,
      prefix: this.constructor.name + ':' + key + ' ~>'
    })

    this._buildRelationships(superstore, this.instancePrototype.relationships)

    this.extendable = Instance.extend(this.instancePrototype)

    superstore.models[key] = this
    superstore.data[key] = this.data

    this.logger.log('connected', this)

    return this
  }

  build (attrs) {
    attrs = attrs || {}
    attrs.id = attrs.id ? attrs.id + '' : generateUUID()

    var instance = new this.extendable()

    Object.assign(instance, attrs)

    Object.defineProperty(instance, '_model', {
      value: this,
      enumerable: false,
      writable: false
    })

    Object.defineProperty(instance, 'logger', {
      value: new Logger({
        debug: this.logger.debug,
        logger: this.logger,
        prefix () {
          return instance._logId + ' ~>'
        }
      }),
      enumerable: false,
      writable: false
    })

    return instance
  }

  query () {
    return new Promise((resolve) => {
      resolve(this.data)
    })
  }

  find (id) {
    id += ''

    return new Promise((resolve) => {
      resolve(this.data.find((item) => {
        return item.id + '' === id
      }))
    })
  }

  save (item) {
    return new Promise((resolve) => {
      if (item.constructor.name !== 'VueComponent') {
        item = this.build(item)
      }

      var changes = item.changes()

      item.updateLastSaved()

      if (this.data.indexOf(item) === -1) {
        this.data.push(item)
      }

      this.logger.log('saved', item._logId, changes)

      resolve(item)
    })
  }

  destroy (item) {
    return new Promise((resolve) => {
      this.data.splice(this.data.indexOf(item), 1)

      this.logger.log('destroyed', item._logId)

      resolve(item)
    })
  }

  _buildRelationships (superstore, relationships) {
    let rel
    let relationship
    let key

    for (key in relationships) {
      rel = relationships[key] || {}

      if (!Object.keys(rel).length) {
        throw new Error(`Relationship has no configuration: ${key}`)
      }

      relationship = Relationships[rel.type](superstore, this, key, rel)

      this.logger.log('relationship:' + key, rel.type)
    }
  }
}

export default Base
