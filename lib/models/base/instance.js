import buildRelationships from './build-relationships.js'

export default function (superstore, model) {
  return {
    computed: buildRelationships(superstore, model),
    methods: {
      init () {
        this.updateLastSaved()
      },

      changes () {
        const lastSave = this._lastSave ? JSON.parse(this._lastSave) : {}
        const current = this.toJSON()
        const obj = {}

        for (const key in current) {
          if (JSON.stringify(lastSave[key]) !== JSON.stringify(current[key])) {
            obj[key] = [lastSave[key], current[key]]
          }
        }

        return obj
      },

      rollback () {
        var changes = this.changes()

        for (var key in changes) {
          this[key] = changes[key][0]
        }

        return this
      },

      hasChanges () {
        return !!Object.keys(this.changes()).length
      },

      toJSON () {
        const props = this._model.instancePrototype.props
        const obj = { id: this.id }

        if (props instanceof Array) {
          for (let i = 0; i < props.length; i++) {
            obj[props[i]] = this[props[i]]
          }
        } else if (typeof props === 'object') {
          for (const key in props) {
            if (typeof this[key] === 'undefined') {
              obj[key] = props[key].default
            } else {
              obj[key] = this[key]
            }
          }
        }

        return obj
      },

      updateLastSaved (data) {
        return this._lastSave = data || JSON.stringify(this.toJSON())
      },

      save () {
        return new Promise((resolve) => {
          var changes = this.changes()

          this.updateLastSaved()

          if (model.data.indexOf(this) === -1) {
            model.data.push(this)
          }

          this.logger.log('saved', changes)

          resolve(this)
        })
      },

      destroy () {
        return new Promise((resolve) => {
          model.data.splice(model.data.indexOf(this), 1)

          this.logger.log('destroyed')

          resolve(this)
        })
      }
    }
  }
}
