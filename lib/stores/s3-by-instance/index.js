/*

------------------------------------------------------------------------
         S3ByInstance: Sync each instance to S3 in its own file
------------------------------------------------------------------------

new Superstore({
  accounts: {
    store: new Superstore.Stores.S3ByInstance({
      accessKeyId: '',
      secretAccessKey: '',
      endpoint: 'https://s3.us-east-1.amazonaws.com',
      apiVersion: 'latest',
      maxRetries: 1,
      instanceConfiguration: {
        key() { // return the name of the file (excluding extension)
          const instance = this
          return instance.id
        },
        accessKeyId() { // optional
          const instance = this
          return instance.accessKeyId
        },
        secretAccessKey() { // optional
          const instance = this
          return instance.secretAccessKey
        },
        bucket() { // optional
          const instance = this
          return instance.bucket
        },
        endpoint() { // optional
          const instance = this
          return instance.endpoint
        },
        apiVersion() { // optional
          const instance = this
          return instance.apiVersion
        },
        maxRetries() { // optional
          const instance = this
          return instance.maxRetries
        },
      }
    }),
    methods: {
      toJSON() { // Overwrite `toJSON` to specify related items to save
        return {
          name: this.name,
          tasks: this.tasks.map((t) => t.toJSON())
        }
      }
    }
  },
  tasks: {}
})

*/

import S3 from '../s3/index.js'

class S3ByInstance extends S3 {
  constructor (options) {
    options = options || {}
    options.instanceConfiguration = options.instanceConfiguration || {}

    if (!options.instanceConfiguration.key) {
      throw new Error('`S3ByInstance.options.instanceConfiguration.key` is required')
    }

    if (typeof options.instanceConfiguration.accessKeyId === 'function') {
      options.accessKeyId = true
    } else if (!options.accessKeyId) {
      throw new Error('`S3ByInstance.options.instanceConfiguration.accessKeyId` is required')
    }

    if (typeof options.instanceConfiguration.secretAccessKey === 'function') {
      options.secretAccessKey = true
    } else if (!options.secretAccessKey) {
      throw new Error('`S3ByInstance.options.instanceConfiguration.secretAccessKey` is required')
    }

    if (typeof options.instanceConfiguration.bucket === 'function') {
      options.bucket = true
    } else if (!options.bucket) {
      throw new Error('`S3ByInstance.options.instanceConfiguration.bucket` is required')
    }

    super(options)

    this.instanceConfiguration = options.instanceConfiguration

    return this
  }

  query (model) {
    return new Promise((resolve) => resolve([]))
  }

  reset () {
    console.warn('S3ByInstance `reset` not implemented.')
  }

  _buildConfigurationOptions (model, instanceOrId) {
    const options = super._buildConfigurationOptions(model, instanceOrId)

    if (typeof instanceOrId === 'object') {
      options.endpoint = typeof this.instanceConfiguration.endpoint === 'function' ? this.instanceConfiguration.endpoint.call(instanceOrId) : options.endpoint
      options.accessKeyId = typeof this.instanceConfiguration.accessKeyId === 'function' ? this.instanceConfiguration.accessKeyId.call(instanceOrId) : options.accessKeyId
      options.secretAccessKey = typeof this.instanceConfiguration.secretAccessKey === 'function' ? this.instanceConfiguration.secretAccessKey.call(instanceOrId) : options.secretAccessKey
      options.apiVersion = typeof this.instanceConfiguration.apiVersion === 'function' ? this.instanceConfiguration.apiVersion.call(instanceOrId) : options.apiVersion
      options.maxRetries = typeof this.instanceConfiguration.maxRetries === 'function' ? this.instanceConfiguration.maxRetries.call(instanceOrId) : options.maxRetries
      options.bucket = typeof this.instanceConfiguration.bucket === 'function' ? this.instanceConfiguration.bucket.call(instanceOrId) : options.bucket
    }

    options.key = this._buildKeyForInstance(model, instanceOrId)

    return options
  }

  _buildKeyForInstance (model, instanceOrId) {
    let key = model.name

    if (typeof instanceOrId === 'string' || typeof instanceOrId === 'number') {
      key += `/${instanceOrId}`
    } else if (typeof instanceOrId === 'object' && typeof this.instanceConfiguration.key === 'function') {
      key += `/${this.instanceConfiguration.key.call(instanceOrId)}`
    }

    return [key, this.extension].join('')
  }
}

export default S3ByInstance
