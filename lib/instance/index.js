import { createApp } from 'vue'

const Instance = createApp({
  data () {
    return { id: id || Math.random() }
  },
  computed: {
    tasks () {
      return tasksModel.tasks.filter((t) => t.id === 2)
    }
  },
  render () {}
})

export default Instance

// import { toRefs, reactive } from 'vue'
// import uniqId from 'uniq-id'
// import Logger from '../logger/index.js'
// import buildRelationships from './build-relationships.js'

// var generateUUID = uniqId.generateUUID('xxxxyxxxxyxxxxyxxxxyxxxxyxxxxyxxxxyxxxxy', 64)

// export default function (model, instance) {
//   model = model || {}

//   instance = instance || {}

//   if (model.props instanceof Array) {
//     for (let i = 0; i < model.props.length; i++) {
//       if (typeof instance[model.props[i]] === 'undefined') {
//         instance[model.props[i]] = null
//       }
//     }
//   } else if (typeof model.props === 'object') {
//     for (const key in model.props) {
//       if (typeof instance[key] === 'undefined') {
//         instance[key] = typeof model.props[key].default !== 'undefined' ? model.props[key].default : null
//       }
//     }
//   }

//   instance.id = instance.id || generateUUID()

//   instance._model = model

//   if (model.logger) {
//     instance.logger = new Logger({
//       debug: model.logger.debug,
//       logger: model.logger,
//       prefix () {
//         return model.name + '#' + this.id + ' ~>'
//       }
//     })
//   }

//   instance.save = () => {
//     if (typeof model.save !== 'function') {
//       throw new Error('`Model.save` is not implemented')
//     }

//     return model.save(instance)
//   }

//   instance.destroy = () => {
//     if (typeof model.destroy !== 'function') {
//       throw new Error('`Model.destroy` is not implemented')
//     }

//     return model.destroy(...arguments)
//   }

//

//   instance.init = () => {
//     instance.updateLastSaved()
//   }

//   buildRelationships(model.superstore, model, instance)

//   instance.init()

//   return instance
// }
