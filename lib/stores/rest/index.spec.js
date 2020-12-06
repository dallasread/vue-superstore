import Rest from './index.js'
import fetch from 'node-fetch'

jest.mock('node-fetch')

describe('Stores:Rest', () => {
  const model = {
    data: [],
    name: 'projects',
    primaryKey: 'id'
  }
  const url = 'https://api.example.com'

  let subject

  beforeEach(() => {
    jest.resetAllMocks()

    subject = new Rest({
      url: url
    })
  })

  it('requires a url', () => {
    expect(() => new Rest()).toThrow(new Error('`Rest.options.url` is required'))
  })

  it('query', async () => {
    const projects = [{ id: 1 }]

    fetch.mockReturnValue(Promise.resolve({ json () { return { projects: projects } } }))

    const response = await subject.query(model)

    expect(response).toEqual(projects)
    expect(fetch).toHaveBeenCalledWith(`${url}/${model.name}.json`, {
      method: 'GET'
    })
  })

  it('find', async () => {
    const project = { id: 1 }

    fetch.mockReturnValue(Promise.resolve({ json () { return { project: project } } }))

    const response = await subject.find(model, project)

    expect(response).toEqual(project)
    expect(fetch).toHaveBeenCalledWith(`${url}/${model.name}/${project.id}.json`, {
      method: 'GET'
    })
  })

  describe('save', () => {
    it('creates', async () => {
      const project = { name: 'Name', toJSON () { return { name: this.name } } }

      fetch.mockReturnValue(Promise.resolve({ json () { return { project } } }))

      const response = await subject.save(model, project)

      expect(response).toEqual(project)
      expect(fetch).toHaveBeenCalledWith(`${url}/${model.name}.json`, {
        method: 'POST',
        body: JSON.stringify(project.toJSON())
      })
    })

    it('updates', async () => {
      const project = { id: 1, toJSON () { return { id: this.id } } }

      fetch.mockReturnValue(Promise.resolve({ json () { return project } }))

      const response = await subject.save(model, project)

      expect(response).toEqual(project)
      expect(fetch).toHaveBeenCalledWith(`${url}/${model.name}/${project.id}.json`, {
        method: 'POST',
        body: JSON.stringify(project.toJSON())
      })
    })
  })

  it('destroy', async () => {
    const id = 7777

    fetch.mockReturnValue(Promise.resolve())

    await subject.destroy(model, id)

    expect(fetch).toHaveBeenCalledWith(`${url}/${model.name}/${id}.json`, {
      method: 'DELETE'
    })
  })

  it('reset', async () => {
    console.warn = jest.fn()

    await subject.reset()

    expect(console.warn).toBeCalledWith('REST `reset` not implemented.')
  })

  describe('formats data', () => {
    it('query', () => {
      const response = [1]

      expect(subject.formatData('query', model, { projects: response })).toEqual(response)
      expect(subject.formatData('query', model, { data: response })).toEqual(response)
      expect(subject.formatData('query', model, response)).toEqual(response)
    })

    it('find', () => {
      const response = { id: 1 }

      expect(subject.formatData('find', model, { project: response })).toEqual(response)
      expect(subject.formatData('find', model, { data: response })).toEqual(response)
      expect(subject.formatData('find', model, response)).toEqual(response)
    })

    it('save', () => {
      const response = { id: 1 }

      expect(subject.formatData('save', model, { project: response })).toEqual(response)
      expect(subject.formatData('save', model, { data: response })).toEqual(response)
      expect(subject.formatData('save', model, response)).toEqual(response)
    })
  })
})
