/*

------------------------------------------------------------------------
          Superstore: *Intuitive* data relationships for Vue
------------------------------------------------------------------------

new Superstore({
  project: {
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
  task: {
    store: new Superstore.Stores.Local({
      name: ''
    })
  }
})

*/

import Stores from '../stores/index.js'
import Models from '../models/index.js'
import Relationships from '../relationships/index.js'
import Utils from '../utils/index.js'

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

function Superstore (reactive, options) {
  const models = {}

  for (const key in options) {
    let model = options[key]

    model.name = key

    if (model.constructor.name === 'Object') {
      model = new Models[getModelType(model)](reactive, models, key, model)
    }

    models[key] = model
  }

  for (const key in options) {
    models[key].buildRelationships(Utils.arrToObj(options[key].relationships || {}))
  }

  return models
}

Superstore.Models = Models
Superstore.Stores = Stores
Superstore.Relationships = Relationships
Superstore.Utils = Utils

export { getModelType, Superstore, Models, Stores, Relationships, Utils }
