/*

------------------------------------------------------------------------
            Rest: Sync each model collection to a REST API
------------------------------------------------------------------------

new Superstore({
  accounts: {
    store: new Superstore.Stores.Rest({
      url: '',
      type: 'json'
    })
  }
})

*/

import fetch from 'node-fetch'
import utils from '../../utils/index.js'

class Rest {
  constructor (options) {
    options = options || {}

    if (!options.url) {
      throw new Error('`Rest.options.url` is required')
    }

    this.url = options.url
    this.type = options.type || 'json'

    return this
  }

  query (model) {
    return new Promise((resolve, reject) => {
      fetch(this._urlForModel(model), {
        method: 'GET'
      }).then((response) => {
        const data = response.json()
        resolve(data[model.name] || data.data || data)
      }).catch(reject)
    })
  }

  find (model, instanceOrId) {
    return new Promise((resolve, reject) => {
      fetch(this._urlForModel(model, instanceOrId), {
        method: 'GET'
      }).then((response) => {
        const data = response.json()
        resolve(data[utils.singularize(model.name)] || data.data || data)
      }).catch(reject)
    })
  }

  save (model, instance) {
    return new Promise((resolve, reject) => {
      fetch(this._urlForModel(model, instance[model.primaryKey]), {
        method: 'POST',
        body: JSON.stringify(instance.toJSON())
      }).then((response) => {
        const data = response.json()
        resolve(data[utils.singularize(model.name)] || data.data || data)
      }).catch(reject)
    })
  }

  destroy (model, instanceOrId) {
    return new Promise((resolve, reject) => {
      fetch(this._urlForModel(model, instanceOrId), {
        method: 'DELETE'
      }).then(() => {
        resolve()
      }).catch(reject)
    })
  }

  _urlForModel (model, instanceOrId) {
    let url = this.url.replace(/\/$/, '')

    url += `/${model.name}`

    if (instanceOrId) {
      if (typeof instanceOrId === 'string' || typeof instanceOrId === 'number') {
        url += `/${instanceOrId}`
      } else if (typeof instanceOrId === 'object') {
        url += `/${instanceOrId[model.primaryKey]}`
      }
    }

    return `${url}.${this.type}`
  }
}

export default Rest
