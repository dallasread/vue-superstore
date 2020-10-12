import { createApp, reactive } from 'vue'
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
    this.data = reactive([])

    this.data.create = (attrs) => {
      const item = this.data.build(attrs)

      item.save()

      return item
    }
    this.data.build = (data) => {
      this.instancePrototype.data = () => {
        data = data || {}
        data.id = data.id ? data.id + '' : generateUUID()
        data._model = this
        data.logger = new Logger({
          debug: this.logger.debug,
          logger: this.logger,
          prefix () {
            return this._model.name + '#' + this.id + ' ~>'
          }
        })

        for (const key in this.props) {
          data[key] = data[key] || this.props[key].default
        }

        return data
      }

      return createApp(this.instancePrototype).mount(document.createElement('div'))
    }

    this.props = options.props || {}

    this.instancePrototype = {
      extends: Instance,
      _model: this,
      computed: options.computed || {},
      mixins: options.mixins || [],
      methods: options.methods || {},
      relationships: options.relationships || {},
      scopes: options.scopes,
      render () {}
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

    superstore.models[key] = this
    superstore.data[key] = this.data

    this.logger.log('connected', this)

    return this
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
      if (item.constructor && item.constructor.name !== 'VueComponent') {
        item = this.data.build(item)
      }

      var changes = item.changes()

      item.updateLastSaved()

      if (this.data.indexOf(item) === -1) {
        this.data.push(item)
      }

      item.logger.log('saved', changes)

      resolve(item)
    })
  }

  destroy (item) {
    return new Promise((resolve) => {
      this.data.splice(this.data.indexOf(item), 1)

      item.logger.log('destroyed')

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
