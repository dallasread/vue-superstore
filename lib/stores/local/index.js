import Base from '../base/index.js'
import localForage from 'localforage'

const findById = (id) => {
  return (item) => {
    return item.id + '' === id
  }
}

class Local extends Base {
  constructor (options) {
    options = options || {}

    super(options)

    this.db = localForage.createInstance({
      name: options.name
    })
  }

  query (model) {
    return this.db.getItem(model._key)
  }

  find (model, id) {
    id += ''

    return new Promise((resolve) => {
      this.query(model).then((items) => {
        resolve(items.find(findById(id)))
      })
    })
  }

  save (model, item) {
    return this.db.setItem(model._key, model.data.map((item) => {
      return item.toJSON()
    })).then(() => {
      model.logger.log('saved', model._key)
    })
  }

  destroy (model, item) {
    return this.save(model, item)
  }
}

export default Local
