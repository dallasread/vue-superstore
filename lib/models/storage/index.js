/*

------------------------------------------------------------------------
             Storage: Model that faciliates data storage
------------------------------------------------------------------------

new Superstore({
  project: {
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
  constructor (reactive, models, name, options) {
    options = options || {}

    super(reactive, models, name, options)

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

      super[action](...args).then(() => {
        this.store[action](...storeArgs).then((result) => {
          resolve(this.inMemory._applyChanges(result))
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
    return new Promise((resolve, reject) => {
      this.inMemory.save(instance)

      this.store.save(this, instance).then((result) => {
        resolve(result)
      }).catch(reject) // TODO: Rollback on fail
    })
  }

  destroy (instance) {
    return this._run('destroy', [instance])
  }

  reset () {
    return this._run('reset', [])
  }
}

export default Storage
