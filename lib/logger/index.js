class Logger {
  constructor (options) {
    options = options || {}

    this.debug = options.debug || false
    this.prefix = options.prefix || ''
    this.repl = options.repl || console
  }

  log () {
    var args = arguments

    if (this.debug) {
      Array.prototype.unshift.call(args, this.prefixed())
      this.repl.log(...args)
    }
  }

  error () {
    var args = arguments

    if (this.debug) {
      Array.prototype.unshift.call(args, this.prefixed())
      this.repl.error(...args)
    }
  }

  warn () {
    var args = arguments

    if (this.debug) {
      Array.prototype.unshift.call(args, this.prefixed())
      this.repl.warn(...args)
    }
  }

  prefixed () {
    return typeof this.prefix === 'function' ? this.prefix() : this.prefix
  }
}

export default Logger
