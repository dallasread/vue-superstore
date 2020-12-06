import utils from './index.js'

describe('Utils', () => {
  it('singularize', () => {
    expect(utils.singularize('tasks')).toEqual('task')
    expect(utils.singularize('bees')).toEqual('bee')
    expect(utils.singularize('poppies')).toEqual('poppy')
    expect(utils.singularize('horses')).toEqual('horse')
    expect(utils.singularize('octopusses')).toEqual('octopus')
    expect(utils.singularize('thing')).toEqual('thing')
  })

  it('pluralize', () => {
    expect(utils.pluralize('task')).toEqual('tasks')
    expect(utils.pluralize('bee')).toEqual('bees')
    expect(utils.pluralize('poppy')).toEqual('poppies')
    expect(utils.pluralize('horse')).toEqual('horses')
    expect(utils.pluralize('octopus')).toEqual('octopusses')
  })

  it('capitalize', () => {
    expect(utils.capitalize('task')).toEqual('Task')
    expect(utils.capitalize('task name')).toEqual('Task name')
    expect(utils.capitalize('camelCase')).toEqual('CamelCase')
  })

  it('uuid', () => {
    expect(utils.uuid().length).toEqual(40)
  })

  it('arrToObj', () => {
    const keys = ['a', 'b']

    expect(utils.arrToObj(keys)).not.toBeInstanceOf(Array)
    expect(utils.arrToObj(keys)).toBeInstanceOf(Object)
    expect(Object.keys(utils.arrToObj(keys))).toEqual(keys)
  })
})
