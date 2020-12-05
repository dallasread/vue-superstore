/*

------------------------------------------------------------------------
             Storage: Model that faciliates data storage
------------------------------------------------------------------------

new Superstore({
  projects: {
    type: 'Storage',
    store: {
      type: 'Local',
      name: 'my-storage'
    }
  }
})

*/

import Base from '../base/index.js'
import Stores from '../../stores/index.js'

class Storage extends Base {
  constructor (computed, models, name, options) {
    options = options || {}

    super(computed, models, name, options)

    if (!options.store) {
      throw new Error('`Storage.options.store` is required')
    }

    if (options.store.constructor.name === 'Object' && options.store.type) {
      options.store = new Stores[options.store.type](options.store)
    }

    this.store = options.store

    return this
  }

  _run (action, args) {
    return new Promise((resolve, reject) => {
      const storeArgs = [this].concat(args.slice(0))

      super[action](...args).then((result) => {
        this.store[action](...storeArgs).then((instances) => {
          if (action === 'query' && instances && instances.length) {
            for (var i = instances.length - 1; i >= 0; i--) {
              const instance = this.build(instances[i])
              this.save(instance)
            }
          }

          resolve(result)
        }).catch(reject)
      }).catch(reject) // TODO: Rollback on fail
    })
  }

  query () {
    return this._run('query', [])
  }

  find (id) {
    return this._run('find', [id])
  }

  save (instance) {
    return this._run('save', [instance])
  }

  destroy (instance) {
    return this._run('destroy', [instance])
  }
}

export default Storage
