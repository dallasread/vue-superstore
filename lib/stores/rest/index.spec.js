import Rest from './index.js'
import fetch from 'node-fetch'

jest.mock('node-fetch')

describe('Stores:REST', () => {
  const model = []
  const url = 'https://api.example.com'

  let subject

  model.name = 'projects'
  model.primaryKey = 'id'

  beforeEach(() => {
    jest.resetAllMocks()

    subject = new Rest({
      url: url
    })
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
})
