export default (superstore, key, options, instancePrototype) => {
  instancePrototype.computed[key] = function _computedBelongsTo () {
    return superstore.data[options.modelName || key]
  }
}
