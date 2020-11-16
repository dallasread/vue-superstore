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
})
