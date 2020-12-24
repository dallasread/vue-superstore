/*

------------------------------------------------------------------------
              InMemory: A Helper for other models
------------------------------------------------------------------------

This model contains the API and functionality for an in-memory model

*/

class InMemory {
  constructor (model) {
    if (!model) {
      throw new Error('`InMemory.model` is required')
    }

    this.model = model
  }

  query () {
    return this.model.data
  }

  find (id) {
    id += ''

    return this.model.data.find((item) => {
      return item[this.model.primaryKey] + '' === id
    })
  }

  create (attrs) {
    const instance = this.model.build(attrs)

    this.save(instance)

    return instance
  }

  save (instance) {
    this._applyChanges(instance)

    return instance
  }

  destroy (instance) {
    const index = this.model.data.indexOf(instance)

    if (index !== -1) {
      this.model.data.splice(index, 1)
    }
  }

  reset () {
    this.model.data.splice(0, this.model.data.length)
  }

  _applyChanges (result) {
    if (!(result instanceof Array)) {
      result = [result]
    }

    result.filter((a) => a).forEach((remoteInstance) => {
      const localInstance = this.find(remoteInstance[this.model.primaryKey])

      if (localInstance) {
        for (const key in remoteInstance) {
          localInstance[key] = remoteInstance[key]
        }
      } else {
        if (remoteInstance.constructor.name !== 'Instance') {
          remoteInstance = this.model.build(remoteInstance)
        }

        this.model.data.push(remoteInstance)
      }
    })
  }
}

export default InMemory
