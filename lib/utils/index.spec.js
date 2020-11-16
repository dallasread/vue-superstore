import utils from './index.js'

describe('Utils', () => {
  it('singularize', () => {
    expect(utils.singularize('tasks')).toBe('task')
    expect(utils.singularize('bees')).toBe('bee')
    expect(utils.singularize('poppies')).toBe('poppy')
    expect(utils.singularize('horses')).toBe('horse')
    expect(utils.singularize('octopusses')).toBe('octopus')
  })

  it('pluralize', () => {
    expect(utils.pluralize('task')).toBe('tasks')
    expect(utils.pluralize('bee')).toBe('bees')
    expect(utils.pluralize('poppy')).toBe('poppies')
    expect(utils.pluralize('horse')).toBe('horses')
    expect(utils.pluralize('octopus')).toBe('octopusses')
  })

  it('capitalize', () => {
    expect(utils.capitalize('task')).toBe('Task')
    expect(utils.capitalize('task name')).toBe('Task name')
    expect(utils.capitalize('camelCase')).toBe('CamelCase')
  })

  it('uuid', () => {
    expect(utils.uuid().length).toBe(40)
  })

  it('arrToObj', () => {
    const keys = ['a', 'b']

    expect(utils.arrToObj(keys)).not.toBeInstanceOf(Array)
    expect(utils.arrToObj(keys)).toBeInstanceOf(Object)
    expect(Object.keys(utils.arrToObj(keys))).toEqual(keys)
  })
})
