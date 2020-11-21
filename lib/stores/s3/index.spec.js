import S3 from './index.js'
import fetch from 'node-fetch'

describe('Stores:S3', () => {
  const model = []
  const url = 'https://api.example.com'

  model.name = 'projects'

  beforeEach(() => {
    jest.resetAllMocks()
    S3.AWS.S3 = jest.fn()
  })

  it('initializes', () => {
    const subject = new S3()

    expect(subject.extension).toEqual('.json')
  })

  describe('buildConfiguration', () => {
    it('requires accessKeyId', () => {
      const subject = new S3()

      expect(() => subject._buildConfiguration(model, 1)).toThrow(new Error('`S3.accessKeyId` is required'))
    })

    it('requires secretAccessKey', () => {
      const subject = new S3({
        accessKeyId: 1
      })

      expect(() => subject._buildConfiguration(model, 1)).toThrow(new Error('`S3.secretAccessKey` is required'))
    })

    it('requires bucket', () => {
      const subject = new S3({
        accessKeyId: 1,
        secretAccessKey: 1
      })

      expect(() => subject._buildConfiguration(model, 1)).toThrow(new Error('`S3.bucket` is required'))
    })

    it('builds correct configuration', () => {
      const options = {
        endpoint: 1,
        accessKeyId: 2,
        secretAccessKey: 3,
        bucket: 'ok',
        apiVersion: 4,
        maxRetries: 5,
        key: 'projects.json'
      }
      const subject = new S3(options)

      expect(subject._buildConfiguration(model, 1).options).toEqual(options)
    })
  })

  it('query', async () => {
    const subject = new S3({ accessKeyId: 2, secretAccessKey: 3, bucket: 'ok' })
    const client = subject._buildConfiguration(model).client
    const projects = [{ id: 1 }]

    client.getObject = jest.fn((data, done) => {
      done(undefined, JSON.stringify({ projects }))
    })

    const response = await subject.query(model)

    expect(response).toEqual(projects)
    expect(client.getObject).toHaveBeenCalledWith({
      Bucket: subject.options.bucket,
      Key: 'projects.json'
    }, expect.anything())
  })

  it('find', async () => {
    const subject = new S3({ accessKeyId: 2, secretAccessKey: 3, bucket: 'ok' })
    const client = subject._buildConfiguration(model).client
    const project = { id: 1 }

    client.getObject = jest.fn((data, done) => {
      done(undefined, JSON.stringify({ project }))
    })

    const response = await subject.find(model, 1)

    expect(response).toEqual(project)
    expect(client.getObject).toHaveBeenCalledWith({
      Bucket: subject.options.bucket,
      Key: 'projects.json'
    }, expect.anything())
  })

  it('save', async () => {
    const subject = new S3({ accessKeyId: 2, secretAccessKey: 3, bucket: 'ok' })
    const client = subject._buildConfiguration(model).client
    const project = { name: 'Name', toJSON () { return { name: this.name } } }

    client.putObject = jest.fn((data, done) => {
      done(undefined, JSON.stringify({ project }))
    })

    const response = await subject.save(model, project)

    expect(response).toEqual(project.toJSON())
    expect(client.putObject).toHaveBeenCalledWith({
      Body: JSON.stringify(project.toJSON()),
      Bucket: subject.options.bucket,
      Key: 'projects.json'
    }, expect.anything())
  })

  it('destroy', async () => {
    const subject = new S3({ accessKeyId: 2, secretAccessKey: 3, bucket: 'ok' })
    const client = subject._buildConfiguration(model).client
    const id = 7777

    client.deleteObject = jest.fn((data, done) => done())

    await subject.destroy(model, id)

    expect(client.deleteObject).toHaveBeenCalledWith({
      Bucket: subject.options.bucket,
      Key: 'projects.json'
    }, expect.anything())
  })
})
