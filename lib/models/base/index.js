import { ref, createApp, reactive } from 'vue'
import Logger from '../../logger/index.js'
import Instance from './instance.js'
import addProp from './add-prop.js'
import buildData from './build-data.js'
import utils from '../../utils/index.js'

class Base {
  constructor (options) {
    const model = this

    options = options || {}

    this.instancePrototype = {
      mixins: options.mixins || [],
      props: options.props || {},
      computed: options.computed || {},
      methods: options.methods || {}
    }

    this.data = []
    this.name = options.name
    this.relationships = options.relationships || {}

    addProp(this.instancePrototype.props, 'id', { type: String, default () { return generateUUID() } })
  }

  query () {
    return new Promise((resolve) => {
      resolve(this.data)
    })
  }

  findById (id) {
    id += ''

    return new Promise((resolve) => {
      resolve(this.data.find((item) => {
        return item.id + '' === id
      }))
    })
  }

  create (attrs) {
    const item = this.build(attrs)

    item.save()

    return item
  }

  build (attrs) {
    return new this.Instance(attrs)
  }

  _connect (superstore, key) {
    const model = this

    model.name = model.name || utils.singularize(key)
    model.superstore = superstore

    model.logger = new Logger({
      debug: superstore.logger.debug,
      logger: superstore.logger,
      prefix: model.constructor.name + ':' + key + ' ~>'
    })

    superstore.models[key] = model

    model.instancePrototype.mixins.push(Instance(superstore, model))

    model.Instance = function (attrs) {
      const instance = createApp({
        mixins: model.instancePrototype.mixins,
        data () {
          return buildData(superstore, model, attrs)
        },
        // props: model.instancePrototype.props,
        computed: model.instancePrototype.computed,
        methods: model.instancePrototype.methods,
        render () {}
      }).mount(document.createElement('div'))

      instance.init()

      return instance
    }

    model.logger.log('connected', model)

    return model
  }
}

export default Base
