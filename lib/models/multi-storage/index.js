/*

------------------------------------------------------------------------
     MultiStorage: Model that faciliates storage to multiple stores
------------------------------------------------------------------------

new Superstore({
  projects: {
    type: 'MultiStorage',
    store: {
      stores: {
        local:
          type: 'Local',
          name: 'my-storage'
        },
        remote: {
          type: 'Rest',
          url: 'https://api.example.com'
        },
        backup: {
          type: 'S3',
          accessKeyId: '',
          secretAccessKey: '',
          bucket: '',
          endpoint: 'https://s3.us-east-1.amazonaws.com',
          apiVersion: 'latest',
          maxRetries: 1
          extension: '.json'
        }
      },
      strategies: { // optionally specify specific order
        query: {
          local: 'synchronous',
          remote: 'asynchronous'
          // backup will not used because no key is supplied
        },
        find: {
          local: 'synchronous',
          remote: 'asynchronous',
          backup: false // backup will not used
        },
        save: {
          remote: 'synchronous',
          local: 'asynchronous',
          backup: 'asynchronous'
        },
        destroy: {
          remote: 'synchronous',
          local: 'asynchronous',
          backup: 'asynchronous'
        }
      }
    }
  }
})

*/

import Stores from '../../stores/index.js'
import Base from '../base/index.js'

class MultiStorage extends Base {
  constructor (computed, models, name, options) {
    let store

    options = options || {}

    super(computed, models, name, options)

    if (!options.stores) {
      throw new Error('`MultiStorage.options.stores` is required')
    }

    for (const key in options.stores) {
      store = options.stores[key]

      if (store.constructor.name === 'Object') {
        options.stores[key] = new Stores[store.type](store)
      }
    }

    this.stores = options.stores
    this.strategies = options.strategies || this._buildDefaultStrategies()
  }

  _buildDefaultStrategies () {
    const obj = {}
    const strategies = { query: obj, find: obj, save: obj, destroy: obj, reset: obj }

    for (const key in this.stores) {
      obj[key] = this.stores[key].constructor.name.indexOf('Local') !== -1 ? 'synchronous' : 'asynchronous'
    }

    return strategies
  }

  _actionsByStrategy (strategy, action) {
    const actions = []

    for (const storeKey in this.strategies[action]) {
      if (this.strategies[action][storeKey] === strategy) {
        actions.push(this.stores[storeKey])
      }
    }

    return actions
  }

  _run (action, args) {
    return new Promise((resolve, reject) => {
      const argsForStores = [this].concat(args)
      const synchronousStores = this._actionsByStrategy('synchronous', action)
      const asynchronousStores = this._actionsByStrategy('asynchronous', action)

      super[action].call(this, ...args).then((result) => {
        Promise.all(synchronousStores.map((store) => {
          return store[action](...argsForStores).then((data) => this.inMemory._applyChanges(data))
        })).then(() => {
          asynchronousStores.forEach((store) => {
            store[action](...argsForStores).then((data) => this.inMemory._applyChanges(data))
          })
          resolve(result)
        }).catch(reject) // TODO: Rollback on synchronous fail
      }).catch(reject)
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

  reset () {
    return this._run('reset', [])
  }
}

export default MultiStorage
