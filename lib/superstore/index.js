/*

------------------------------------------------------------------------
          Superstore: *Intuitive* data relationships for Vue
------------------------------------------------------------------------

new Superstore({
  projects: {
    type: 'Storage'
    props: ['name'],
    relationships: {
      tasks: {
        type: 'HasMany'
      }
    },
    store: {
      type: 'Local'
      name: ''
    },
    methods: {
      updateName (name) {
        this.name = name
        this.save()
      }
    }
  },
  tasks: {
    store: new Superstore.Stores.Local({
      name: ''
    })
  }
})

*/

import Stores from '../stores/index.js'
import Models from '../models/index.js'

function Superstore (reactive, computed, options) {
  const models = {}

  for (const key in options) {
    let model = options[key]
    let constructor

    if (model.constructor.name === 'Object') {
      constructor = Models[model.type] || (model.store ? Models.Storage : Models.Base)
      model = new constructor(computed, models, key, model)
    }

    models[key] = reactive(model)
  }

  return models
}

Superstore.Models = Models
Superstore.Stores = Stores

export default Superstore
