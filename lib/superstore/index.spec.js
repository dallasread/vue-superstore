import { reactive } from 'vue'
import { getModelType, Superstore } from './index.js'
import Model from '../models/base/index.js'
import Storage from '../models/storage/index.js'

describe('Superstore', () => {
  it('initializes models', () => {
    const subject = new Superstore(reactive, undefined, {
      tasks: {},
      projects: {
        store: {
          type: 'Local',
          name: 'local'
        }
      }
    })

    expect(subject.tasks).toBeInstanceOf(Model)
    expect(subject.projects).toBeInstanceOf(Storage)
    expect(Object.keys(subject).length).toEqual(2)
  })

  it('initializes allows special objects', () => {
    const props = [{ name: { type: String } }]
    class A extends Array { constructor () { super(); this.props = props } buildRelationships() {} }
    const subject = new Superstore(reactive, undefined, {
      tasks: new A()
    })

    expect(subject.tasks).toBeInstanceOf(A)
    expect(subject.tasks.props).toEqual(props)
  })

  it('sets the default model type', () => {
    expect(getModelType({})).toEqual('Base')
    expect(getModelType({ type: 'Type' })).toEqual('Type')
    expect(getModelType({ store: 1 })).toEqual('Storage')
    expect(getModelType({ stores: 1 })).toEqual('MultiStorage')
  })
})
