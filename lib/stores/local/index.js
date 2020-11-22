/*

------------------------------------------------------------------------
           Local: Sync each model collection to LocalStorage
------------------------------------------------------------------------

new Superstore({
  accounts: {
    store: new Superstore.Stores.Local({
      name: ''
    })
  }
})

*/

import localForage from 'localforage'

class Local {
  constructor (options) {
    options = options || {}

    if (!options.name) {
      throw new Error('`Local.options.name` is required')
    }

    this.db = localForage.createInstance({
      name: options.name
    })

    return this
  }

  query (model) {
    return this.db.getItem(model.name)
  }

  find (model, id) {
    id += ''

    return new Promise((resolve) => {
      this.query(model).then((instances) => {
        resolve((instances || []).find((instance) => instance[model.primaryKey] + '' === id))
      })
    })
  }

  save (model, instance) {
    return this.db.setItem(model.name, model.map((instance) => instance.toJSON()))
  }

  destroy (model, instance) {
    return this.save(model, instance)
  }
}

export default Local
