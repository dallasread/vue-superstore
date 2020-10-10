export default (key, options, instancePrototype) => {
  options.primaryKey = options.primaryKey || 'id'

  if (options.foreignKey) {
    instancePrototype.computed[key] = function _computedHasMany () {
      var __ = this

      return this._superstore.data[key].filter(function (record) {
        return record[options.foreignKey].indexOf(__[options.primaryKey]) !== -1
      })
    }

    instancePrototype.methods['add' + capitalize(key)] = function _addHasMany () {
      var __ = this
      var records = Array.prototype.slice.call(arguments)

      // TODO: Create if needed

      for (var i = records.length - 1; i >= 0; i--) {
        records[i][options.foreignKey].push(__[options.primaryKey])
      }

      return records
    }
  } else {
    options.foreignKey = options.foreignKey || 'id'

    instancePrototype.computed[key] = function _computedHasManyIds () {
      var __ = this

      return this._superstore.data[key].filter(function (record) {
        return __[options.primaryKey].indexOf(record[options.foreignKey]) !== -1
      })
    }

    instancePrototype.methods['add' + capitalize(key)] = function _addHasManyIds () {
      var __ = this
      var records = Array.prototype.slice.call(arguments)

      // TODO: Create if needed

      for (var i = records.length - 1; i >= 0; i--) {
        __[options.primaryKey].push(records[i][options.foreignKey])
      }

      return records
    }
  }
}
