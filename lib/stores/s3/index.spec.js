import S3 from './index.js'

const DEFAULT_OPTIONS = {
  accessKeyId: 2,
  secretAccessKey: 3,
  bucket: 'ok'
}

describe('Stores:S3', () => {
  const model = []

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

  describe('query', () => {
    it('returns data', async () => {
      const subject = new S3(DEFAULT_OPTIONS)
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

    it('returns error', () => {
      const subject = new S3(DEFAULT_OPTIONS)
      const client = subject._buildConfiguration(model).client
      const error = 'Something went wrong'

      client.getObject = jest.fn((data, done) => {
        done(error)
      })

      return subject.query(model, 1).catch((err) => {
        expect(err).toEqual(error)
      })
    })
  })

  describe('find', () => {
    it('returns data', async () => {
      const subject = new S3(DEFAULT_OPTIONS)
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

    it('returns error', () => {
      const subject = new S3(DEFAULT_OPTIONS)
      const client = subject._buildConfiguration(model).client
      const error = 'Something went wrong'

      client.getObject = jest.fn((data, done) => {
        done(error)
      })

      return subject.find(model, 1).catch((err) => {
        expect(err).toEqual(error)
      })
    })
  })

  describe('save', () => {
    it('writes data', async () => {
      const subject = new S3(DEFAULT_OPTIONS)
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

    it('returns error', () => {
      const subject = new S3(DEFAULT_OPTIONS)
      const client = subject._buildConfiguration(model).client
      const project = { name: 'Name', toJSON () { return { name: this.name } } }
      const error = 'Something went wrong'

      client.putObject = jest.fn((data, done) => {
        done(error)
      })

      return subject.save(model, project).catch((err) => {
        expect(err).toEqual(error)
      })
    })
  })

  describe('destroy', () => {
    it('writes data', async () => {
      const subject = new S3(DEFAULT_OPTIONS)
      const client = subject._buildConfiguration(model).client
      const id = 7777

      client.deleteObject = jest.fn((data, done) => done())

      await subject.destroy(model, id)

      expect(client.deleteObject).toHaveBeenCalledWith({
        Bucket: subject.options.bucket,
        Key: 'projects.json'
      }, expect.anything())
    })

    it('returns error', () => {
      const subject = new S3(DEFAULT_OPTIONS)
      const client = subject._buildConfiguration(model).client
      const error = 'Something went wrong'

      client.deleteObject = jest.fn((data, done) => {
        done(error)
      })

      return subject.destroy(model, 1).catch((err) => {
        expect(err).toEqual(error)
      })
    })
  })

  it('reset', async () => {
    const subject = new S3(DEFAULT_OPTIONS)

    console.warn = jest.fn()

    await subject.reset()

    expect(console.warn).toBeCalledWith('S3 `reset` not implemented.')
  })

  describe('formats data', () => {
    let subject

    beforeEach(() => {
      subject = new S3(DEFAULT_OPTIONS)
    })

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
