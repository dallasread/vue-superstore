import { reactive } from 'vue'
import Superstore from './index.js'
import Model from '../models/base/index.js'

describe('Superstore', () => {
  it('initializes models', () => {
    const subject = new Superstore(reactive, undefined, {
      tasks: {
        props: []
      }
    })

    expect(subject.tasks).toBeInstanceOf(Model)
    expect(Object.keys(subject).length).toBe(1)
  })

  it('initializes allows special objects', () => {
    const props = [{ name: { type: String } }]
    class A extends Array { constructor () { super(); this.props = props } }
    const subject = new Superstore(reactive, undefined, {
      tasks: new A()
    })

    expect(subject.tasks.constructor).toBe(A)
    expect(subject.tasks.props).toEqual(props)
  })
})
