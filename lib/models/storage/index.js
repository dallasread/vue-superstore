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

class Storage extends Base {
  constructor (computed, models, name, options) {
    options = options || {}

    if (!options.store) {
      throw new Error('`Storage.options.store` is required')
    }

    super(computed, models, name, options)

    this.store = options.store

    return this
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

export default Storage
