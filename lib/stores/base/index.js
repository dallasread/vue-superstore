import Logger from '../../logger/index.js'

class Base {
  _connect (superstore, key) {
    Object.defineProperty(this, 'superstore', {
      value: superstore,
      enumerable: false,
      writable: false
    })

    this.logger = new Logger({
      debug: superstore.logger.debug,
      logger: superstore.logger,
      prefix: this.constructor.name + ':' + key + ' ~>'
    })

    this.logger.log('connected', this)

    return this
  }

  query () {
    return new Promise((resolve) => {
      this.logger.warn('`query` not implemented')
      resolve()
    })
  }

  find () {
    return new Promise((resolve) => {
      this.logger.warn('`find` not implemented')
      resolve()
    })
  }

  save () {
    return new Promise((resolve) => {
      this.logger.warn('`save` not implemented')
      resolve()
    })
  }

  destroy () {
    return new Promise((resolve) => {
      this.logger.warn('`destroy` not implemented')
      resolve()
    })
  }
}

export default Base
