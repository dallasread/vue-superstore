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

const getModelType = (model) => {
  if (model.type) {
    return model.type
  } else if (model.store) {
    return 'Storage'
  } else if (model.stores) {
    return 'MultiStorage'
  } else {
    return 'Base'
  }
}

function Superstore (reactive, computed, options) {
  const models = {}

  for (const key in options) {
    let model = options[key]

    model.name = key

    if (model.constructor.name === 'Object') {
      model = new Models[getModelType(model)](computed, models, key, model)
    }

    models[key] = reactive(model)
  }

  return models
}

Superstore.Models = Models
Superstore.Stores = Stores

export default Superstore
