/*

------------------------------------------------------------------------
             BelongsTo: One instance is related to another
------------------------------------------------------------------------

new Superstore({
  project: {},
  task: {
    relationships: {
      project: {
        type: 'BelongsTo'
      }
    }
  }
})

*/

import Utils from '../../utils/index.js'
import { ref } from 'vue'

class BelongsTo {
  constructor (models, key, model, relationship) {
    this.key = key
    this.model = model
    this.foreignModel = models[relationship.foreignModel || `${Utils.singularize(key)}`]
    this.primaryKey = relationship.primaryKey || this.foreignModel.defaultForeignKey
    this.foreignKey = relationship.foreignKey || this.foreignModel.primaryKey
    this.model.props[this.primaryKey] = this.model.props[this.primaryKey] || {}
  }

  initializeInstance (instance) {
    const reference = ref(instance[this.primaryKey] || null)

    if (!(this.primaryKey in instance)) {
      Object.defineProperty(instance, this.primaryKey, {
        get () {
          return reference.value
        },
        set (value) {
          reference.value = value

          return reference.value
        }
      })
    }

    const relationship = this
    Object.defineProperty(instance, relationship.key, {
      get () {
        return relationship.foreignModel.data.find((item) => {
          return item[relationship.foreignKey] + '' === instance[relationship.primaryKey] + ''
        })
      },
      set (item) {
        instance[relationship.primaryKey] = item[relationship.foreignKey]
        return item
      }
    })
  }
}

export default BelongsTo
