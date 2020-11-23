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

import Base from '../base/index.js'

class MultiStorage extends Base {
  constructor (computed, models, name, options) {
    options = options || {}

    if (!options.stores) {
      throw new Error('`MultiStorage.options.stores` is required')
    }

    super(computed, models, name, options)

    this.stores = options.stores || {}
    this.strategies = options.strategies || this._buildDefaultStrategies()
  }

  _buildDefaultStrategies () {
    const obj = {}
    const strategies = { query: obj, find: obj, save: obj, destroy: obj }

    for (const key in this.stores) {
      obj[key] = this.stores[key].constructor.name === 'Local' ? 'synchronous' : 'asynchronous'
    }

    return strategies
  }

  _actionsByStrategy (strategy, action) {
    const actions = []

    for (const storeKey in this.strategies[action]) {
      if (this.strategies[action][storeKey] === strategy) {
        actions.push(this.stores[storeKey][action])
      }
    }

    return actions
  }

  _run (action, args) {
    return new Promise((resolve, reject) => {
      const synchronousActions = this._actionsByStrategy('synchronous', action)
      const asynchronousActions = this._actionsByStrategy('asynchronous', action)

      Promise.all(synchronousActions.map((a) => {
        return a.call(this, ...args)
      })).then(() => {
        for (let i = 0; i < asynchronousActions.length; i++) {
          asynchronousActions[i].call(this, ...args)
        }

        super[action].call(this, ...args).then(resolve).catch(reject)
      }).catch(reject)
    })
  }

  query () {
    return this._run('query', arguments)
  }

  find (id) {
    return this._run('find', arguments)
  }

  save (instance) {
    return this._run('save', arguments)
  }

  destroy (instance) {
    return this._run('destroy', arguments)
  }
}

export default MultiStorage
