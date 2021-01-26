/*

------------------------------------------------------------------------
             S3: Sync each model collection to its own file
------------------------------------------------------------------------

new Superstore({
  account: {
    store: new Superstore.Stores.S3({
      accessKeyId: '',
      secretAccessKey: '',
      bucket: '',
      endpoint: 'https://s3.us-east-1.amazonaws.com',
      apiVersion: 'latest',
      maxRetries: 1
      extension: '.json'
    })
  }
})

*/

import AWS from 'aws-sdk'
import Utils from '../../utils/index.js'

class S3 {
  constructor (options) {
    options = options || {}

    this.clients = {}
    this.extension = options.extension || '.json'
    this.options = options

    return this
  }

  query (model) {
    return new Promise((resolve, reject) => {
      const configuration = this._buildConfiguration(model)

      configuration.client.getObject({
        Bucket: configuration.options.bucket,
        Key: configuration.options.key
      }, (err, data) => {
        if (err) {
          return reject(err)
        }

        resolve(this.formatData('query', model, JSON.parse(data)))
      })
    })
  }

  find (model, id) {
    return new Promise((resolve, reject) => {
      const configuration = this._buildConfiguration(model, id)

      configuration.client.getObject({
        Bucket: configuration.options.bucket,
        Key: configuration.options.key
      }, (err, data) => {
        if (err) {
          return reject(err)
        }

        resolve(this.formatData('find', model, JSON.parse(data)))
      })
    })
  }

  save (model, instance) {
    return new Promise((resolve, reject) => {
      const configuration = this._buildConfiguration(model, instance)

      configuration.client.putObject({
        Body: JSON.stringify(instance.toJSON()),
        Bucket: configuration.options.bucket,
        Key: configuration.options.key
      }, (err, data) => {
        if (err) {
          return reject(err)
        }

        resolve(this.formatData('save', model, JSON.parse(data)))
      })
    })
  }

  destroy (model, instanceOrId) {
    return new Promise((resolve, reject) => {
      const configuration = this._buildConfiguration(model, instanceOrId)

      configuration.client.deleteObject({
        Bucket: configuration.options.bucket,
        Key: configuration.options.key
      }, (err, data) => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  }

  reset () {
    console.warn('S3 `reset` not implemented.')
  }

  formatData (action, model, data) {
    if (action === 'query') {
      return data[Utils.pluralize(model.name)] || data.data || data
    } else if (action === 'find') {
      return data[Utils.singularize(model.name)] || data.data || data
    } else if (action === 'save') {
      return data[Utils.singularize(model.name)] || data.data || data
    }
  }

  _buildConfiguration (model, instanceOrId) {
    const options = this._buildConfigurationOptions(model, instanceOrId)
    const clientOptions = {
      endpoint: new AWS.Endpoint(options.endpoint),
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
      apiVersion: options.apiVersion,
      maxRetries: options.maxRetries
    }
    const hash = JSON.stringify(clientOptions)

    this.clients[hash] = this.clients[hash] || new AWS.S3(clientOptions)

    return {
      client: this.clients[hash],
      options: options
    }
  }

  _buildConfigurationOptions (model, instanceOrId) {
    const options = {}

    options.accessKeyId = this.options.accessKeyId
    options.secretAccessKey = this.options.secretAccessKey
    options.bucket = this.options.bucket

    if (!options.accessKeyId) {
      throw new Error('`S3.accessKeyId` is required')
    }

    if (!options.secretAccessKey) {
      throw new Error('`S3.secretAccessKey` is required')
    }

    if (!options.bucket) {
      throw new Error('`S3.bucket` is required')
    }

    options.endpoint = this.options.endpoint || 'https://s3.us-east-1.amazonaws.com'
    options.apiVersion = this.options.apiVersion || 'latest'
    options.maxRetries = this.options.maxRetries || 1
    options.key = [Utils.pluralize(model.name), this.extension].join('')

    return options
  }
}

S3.AWS = AWS

export default S3
