// import Base from '../base/index.js'

// class StorageModel extends Base {
//   constructor (options) {
//     options.methods = options.methods || {}

//     super(options)

//     this.storage = options.storage || {}

//     for (var key in options.methods) {
//       this[key] = options.methods[key]
//     }

//     this.perInstanceStores = {}
//   }

//   _getStore (store, item, key) {
//     if (typeof store === 'function' && typeof item === 'object' && item.id) {
//       if (typeof this.perInstanceStores[key] === 'object') {
//         store = this.perInstanceStores[key]
//       } else {
//         store = store.call(item)

//         if (typeof store === 'object' && typeof store._connect === 'function') {
//           store._connect(this, item.id)
//           this.perInstanceStores[key] = store
//         }
//       }
//     }

//     return store
//   }

//   _eachStore (method, item, args, success) {
//     var storage = this.storage
//     var promises = []
//     var store

//     for (var key in storage) {
//       store = this._getStore(storage[key], item, key + (item ? '-' + item.id : ''))

//       if (typeof store === 'object' && typeof store[method] === 'function') {
//         promises.push(
//           store[method].apply(store, args)
//         )
//       }
//     }

//     return Promise.all(promises).then(success)
//   }

//   query (data) {
//     this._eachStore('query', data, [])

//     return Base.prototype.query.call(this)
//   }

//   save (item) {
//     var changes = item.changes()

//     Base.prototype.save.call(this, item)

//     this._eachStore('save', item, [item, changes])

//     return item
//   }

//   destroy (item) {
//     Base.prototype.destroy.call(this, item)

//     this._eachStore('destroy', item, [item])

//     return item
//   }
// }

// export default StorageModel
