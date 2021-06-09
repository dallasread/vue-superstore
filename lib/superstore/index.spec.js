import { reactive } from 'vue'
import { getModelType, Superstore } from './index.js'
import Model from '../models/base/index.js'
import Storage from '../models/storage/index.js'

describe('Superstore', () => {
  it('initializes models', () => {
    const subject = new Superstore(reactive, {
      task: {},
      project: {
        store: {
          type: 'Local',
          name: 'local'
        }
      }
    })

    expect(subject.task).toBeInstanceOf(Model)
    expect(subject.project).toBeInstanceOf(Storage)
    expect(Object.keys(subject).length).toEqual(2)
  })

  it('initializes allows special objects', () => {
    const props = [{ name: { type: String } }]
    class Task extends Array { constructor () { super(); this.props = props } buildRelationships () {} }
    const subject = new Superstore(reactive, {
      task: new Task()
    })

    expect(subject.task).toBeInstanceOf(Task)
    expect(subject.task.props).toEqual(props)
  })

  it('sets the default model type', () => {
    expect(getModelType({})).toEqual('Base')
    expect(getModelType({ type: 'Type' })).toEqual('Type')
    expect(getModelType({ store: 1 })).toEqual('Storage')
    expect(getModelType({ stores: 1 })).toEqual('MultiStorage')
  })
})
