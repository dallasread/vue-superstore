/*

------------------------------------------------------------------------
              Base: Simple model for in-memory storage
------------------------------------------------------------------------

new Superstore({
  project: {
    type: 'Base',
    primaryKey: 'id',
    defaultForeignKey: 'projectId',
    props: ['name'],
    relationships: {
      tasks: {
        type: 'HasMany'
      }
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
  task: new Superstore.Models.Base({})
})

*/

import Utils from '../../utils/index.js'
import Instance from '../../instance/index.js'
import InMemory from '../in-memory/index.js'
import Relationships from '../../relationships/index.js'

class Base {
  constructor (reactive, models, name, options) {
    if (!name) {
      throw new Error('`Base.options.name` is required')
    }

    options = options || {}

    this.primaryKey = options.primaryKey || 'id'
    this.models = models
    this.name = name
    this.props = Utils.arrToObj(options.props || {})
    this.props[this.primaryKey] = this.props[this.primaryKey] || { type: String, default () { return Utils.uuid() } }
    this.relationships = {}
    this.methods = options.methods || {}
    this.computed = options.computed || {}
    this.defaultForeignKey = options.defaultForeignKey || `${Utils.singularize(this.name)}${Utils.capitalize(this.primaryKey)}`
    this.data = reactive([])
    this.inMemory = new InMemory(this)

    return this
  }

  buildRelationships (relationships) {
    for (const key in relationships) {
      const relationship = relationships[key]
      this.relationships[key] = new Relationships[relationship.type](this.models, key, this, relationship)
    }
  }

  build (attrs) {
    return new Instance(this.models, this.name, attrs)
  }

  create (attrs) {
    const instance = this.build(attrs)

    this.save(instance)

    return instance
  }

  _runInMemory (method, args) {
    const result = this.inMemory[method](...args)

    return new Promise((resolve) => {
      resolve(result)
    })
  }

  query () {
    return this._runInMemory('query', [])
  }

  find (id) {
    return this._runInMemory('find', [id])
  }

  save (instance) {
    return this._runInMemory('save', [instance])
  }

  destroy (instance) {
    return this._runInMemory('destroy', [instance])
  }

  reset () {
    return this._runInMemory('reset', [])
  }

  empty () {
    return !this.data.length
  }
}

export default Base
