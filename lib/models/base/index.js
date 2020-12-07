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

    return this
  }

  applyChanges (result) {
    if (!(result instanceof Array)) {
      result = [result]
    }

    result.filter((a) => a).forEach((remoteInstance) => {
      const localInstance = this.findLocal(remoteInstance.id)

      if (localInstance) {
        for (const key in this.props) {
          if (typeof remoteInstance[key] !== 'undefined') {
            localInstance[key] = remoteInstance[key]
          }
        }
      } else {
        if (remoteInstance.constructor.name !== 'Instance') {
          remoteInstance = this.build(remoteInstance)
        }

        this.data.push(remoteInstance)
      }
    })
  }

  build (attrs) {
    return new Instance(this.models, this.name, attrs)
  }

  query () {
    return new Promise((resolve) => {
      resolve(this.data)
    })
  }

  find (id) {
    return new Promise((resolve) => {
      resolve(this.findLocal(id))
    })
  }

  create (attrs) {
    const instance = this.build(attrs)

    this.save(instance)

    return instance
  }

  save (instance) {
    this.applyChanges(instance)

    return new Promise((resolve) => {
      resolve(instance)
    })
  }

  destroy (instance) {
    const index = this.data.indexOf(instance)

    if (index !== -1) {
      this.data.splice(index, 1)
    }

    return new Promise((resolve) => {
      resolve()
    })
  }

  reset () {
    this.data.splice(0, this.data.length)

    return new Promise((resolve) => {
      resolve()
    })
  }

  findLocal (id) {
    id += ''

    return this.data.filter((item) => {
      return item[this.primaryKey] + '' === id
    })[0]
  }
}

export default Base
