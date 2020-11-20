import localForage from 'localforage'
import { uuid } from '../../utils/index.js'

class Local {
  constructor (options) {
    options = options || {}

    if (!options.name) {
      throw new Error('`Local.options.name` is required')
    }

    this.db = localForage.createInstance({
      name: options.name
    })
  }

  query (model) {
    return this.db.getItem(model.name)
  }

  find (model, id) {
    id += ''

    return new Promise((resolve) => {
      this.query(model).then((items) => {
        resolve((items || []).find((item) => item.id + '' === id))
      })
    })
  }

  save (model, item) {
    return this.db.setItem(model.name, model.map((item) => item.toJSON()))
  }

  destroy (model, item) {
    return this.save(model, item)
  }
}

export default Local
