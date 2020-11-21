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

class StorageModel extends Base {
  constructor (options) {
    options = options || {}

    if (!options.store) {
      throw new Error('`StorageModel.options.store` is required')
    }

    super(options)

    this.store = options.store
  }

  query () {
    return this.store.query(this)
  }

  find (id) {
    return this.store.find(this, id)
  }

  save (instance) {
    return this.store.save(this, instance)
  }

  destroy (instance) {
    return this.store.destroy(this, instance)
  }
}

export default StorageModel
