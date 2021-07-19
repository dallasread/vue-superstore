/*

------------------------------------------------------------------------
           Local: Sync each model collection to LocalStorage
------------------------------------------------------------------------

new Superstore({
  account: {
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

    this.saveTimer = undefined

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
    clearInterval(this.saveTimer)

    return new Promise((resolve, reject) => {
      this.saveTimer = setTimeout(() => {
        const items = model.data.map((i) => i.toJSON())

        this.db.setItem(model.name, items).then(() => {
          resolve(instance)
        }).catch(reject)
      }, 0)
    })
  }

  destroy (model, instance) {
    return new Promise((resolve, reject) => {
      this.save(model, instance).then(() => resolve()).catch(reject)
    })
  }

  reset (model) {
    return new Promise((resolve, reject) => {
      this.db.setItem(model.name, []).then(() => {
        resolve()
      }).catch(reject)
    })
  }
}

export default Local
