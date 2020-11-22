/*

------------------------------------------------------------------------
              Base: Simple model for in-memory storage
------------------------------------------------------------------------

new Superstore({
  projects: {
    type: 'Base',
    primaryKey: 'id',
    defaultForeignKey: 'projectId',
    props: ['name'],
    relationships: {
      tasks: {
        type: 'HasMany'
      }
    },
    store: {
      type: 'Local'
      name: ''
    },
    computed: {
      nickname() {
        return this.name.toLowerCase().slice(0, 3)
      }
    },
    methods: {
      updateName (name) {
        this.name = name
        this.save()
      }
    }
  },
  tasks: new Superstore.Models.Base({})
})

*/

import utils from '../../utils/index.js'
import Instance from '../../instance/index.js'
import Stores from '../../stores/index.js'

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

    if (options.store && options.store.constructor === 'Object') {
      this.store = new Stores[options.store.type](options.store)
    }

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
      resolve(super.find((item) => {
        return item[this.primaryKey] + '' === id
      }))
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
