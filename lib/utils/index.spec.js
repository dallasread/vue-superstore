import Utils from './index.js'

describe('Utils', () => {
  it('singularize', () => {
    expect(Utils.singularize('tasks')).toEqual('task')
    expect(Utils.singularize('bees')).toEqual('bee')
    expect(Utils.singularize('poppies')).toEqual('poppy')
    expect(Utils.singularize('horses')).toEqual('horse')
    expect(Utils.singularize('octopusses')).toEqual('octopus')
    expect(Utils.singularize('thing')).toEqual('thing')
  })

  it('pluralize', () => {
    expect(Utils.pluralize('task')).toEqual('tasks')
    expect(Utils.pluralize('bee')).toEqual('bees')
    expect(Utils.pluralize('poppy')).toEqual('poppies')
    expect(Utils.pluralize('horse')).toEqual('horses')
    expect(Utils.pluralize('octopus')).toEqual('octopusses')
  })

  it('capitalize', () => {
    expect(Utils.capitalize('task')).toEqual('Task')
    expect(Utils.capitalize('task name')).toEqual('Task name')
    expect(Utils.capitalize('camelCase')).toEqual('CamelCase')
  })

  it('uuid', () => {
    expect(Utils.uuid().length).toEqual(40)
  })

  it('arrToObj', () => {
    const keys = ['a', 'b']

    expect(Utils.arrToObj(keys)).not.toBeInstanceOf(Array)
    expect(Utils.arrToObj(keys)).toBeInstanceOf(Object)
    expect(Object.keys(Utils.arrToObj(keys))).toEqual(keys)
  })
})
