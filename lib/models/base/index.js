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
import InMemory from '../in-memory/index.js'

class Base {
  constructor (computed, models, name, options) {
    if (!name) {
      throw new Error('`Base.options.name` is required')
    }

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
    this.data = []
    this.inMemory = new InMemory(this)

    return this
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
}

export default Base
