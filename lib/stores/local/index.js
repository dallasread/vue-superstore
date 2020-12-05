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
    return new Promise((resolve, reject) => {
      const items = []

      for (var i = model.length - 1; i >= 0; i--) {
        items.push(model[i].toJSON())
      }

      this.db.setItem(model.name, items).then(() => {
        resolve(instance)
      }).catch(reject)
    })
  }

  destroy (model, instance) {
    return new Promise((resolve, reject) => {
      this.save(model, instance).then(() => resolve()).catch(reject)
    })
  }
}

export default Local
