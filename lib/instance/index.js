export default {
  _isComponent: false,

  computed: {
    _logId () {
      return this._model.name + '#' + this.id
    }
  },

  methods: {
    toJSON () {
      const props = this._model.instancePrototype.props
      const result = {
        id: this.id
      }

      if (props instanceof Array) {
        for (let i = 0; i < props.length; i++) {
          result[props[i]] = this[props[i]]
        }
      } else if (typeof props === 'object') {
        for (const key in props) {
          result[key] = this[key]
        }
      }

      return result
    },

    changes () {
      const lastSave = this._lastSave ? JSON.parse(this._lastSave) : {}
      const current = this.toJSON()
      const result = {}

      for (const key in current) {
        if (JSON.stringify(lastSave[key]) !== JSON.stringify(current[key])) {
          result[key] = [lastSave[key], current[key]]
        }
      }

      return result
    },

    updateLastSaved (data) {
      this._lastSave = data || JSON.stringify(this.toJSON())
    },

    hasChanges () {
      return !!Object.keys(this.changes()).length
    },

    save () {
      return this._model.save(this).then(() => {
        this.updateLastSaved()
      })
    },

    destroy () {
      return this._model.destroy(this)
    },

    rollback () {
      var changes = this.changes()

      for (var key in changes) {
        this[key] = changes[key][0]
      }

      return this
    }
  }
}
