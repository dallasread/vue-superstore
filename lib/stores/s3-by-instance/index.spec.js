import S3ByInstance from './index.js'

describe('Stores:S3ByInstance', () => {
  const model = []

  model.name = 'projects'

  beforeEach(() => {
    jest.resetAllMocks()
    S3ByInstance.AWS.S3 = jest.fn()
  })

  describe('buildConfiguration', () => {
    it('requires instanceConfiguration', () => {
      expect(() => new S3ByInstance()).toThrow(new Error('`S3ByInstance.options.instanceConfiguration.key` is required'))
    })

    it('requires instance values', () => {
      expect(() => {
        new S3ByInstance({ bucket: 'ok', instanceConfiguration: { key () { return 1 } } }) // eslint-disable-line no-new
      }).toThrow(new Error('`S3ByInstance.options.instanceConfiguration.accessKeyId` is required'))
    })

    it('uses instance values', () => {
      const key = 'my-key'
      const accessKeyId = 'access-key'
      const secretAccessKey = 'secret'
      const options = {
        bucket: 'ok',
        instanceConfiguration: {
          key () {
            return key
          },
          accessKeyId () {
            return accessKeyId
          },
          secretAccessKey () {
            return secretAccessKey
          }
        }
      }
      const subject = new S3ByInstance(options)

      expect(subject._buildConfiguration(model, {}).options.key).toEqual(`projects/${key}.json`)
      expect(subject._buildConfiguration(model, {}).options.accessKeyId).toEqual(accessKeyId)
      expect(subject._buildConfiguration(model, {}).options.secretAccessKey).toEqual(secretAccessKey)
    })
  })

  it('query', async () => {
    const subject = new S3ByInstance({ accessKeyId: 2, secretAccessKey: 3, bucket: 'ok', instanceConfiguration: { key () { return 1 } } })

    const response = await subject.query()

    expect(response).toEqual([])
  })

  it('find', async () => {
    const project = { id: 5 }
    const subject = new S3ByInstance({ accessKeyId: 2, secretAccessKey: 3, bucket: 'ok', instanceConfiguration: { key () { return this.id } } })
    const client = subject._buildConfiguration(model).client

    client.getObject = jest.fn((data, done) => {
      done(undefined, JSON.stringify({ project }))
    })

    const response = await subject.find(model, project.id)

    expect(response).toEqual(project)
    expect(client.getObject).toHaveBeenCalledWith({
      Bucket: subject.options.bucket,
      Key: `projects/${project.id}.json`
    }, expect.anything())
  })

  it('save', async () => {
    const id = 5
    const subject = new S3ByInstance({ accessKeyId: 2, secretAccessKey: 3, bucket: 'ok', instanceConfiguration: { key () { return this.id } } })
    const client = subject._buildConfiguration(model).client
    const project = { id, name: 'Name', toJSON () { return { name: this.name } } }

    client.putObject = jest.fn((data, done) => {
      done(undefined, JSON.stringify({ project }))
    })

    const response = await subject.save(model, project)

    expect(response).toEqual(project.toJSON())
    expect(client.putObject).toHaveBeenCalledWith({
      Body: JSON.stringify(project.toJSON()),
      Bucket: subject.options.bucket,
      Key: `projects/${id}.json`
    }, expect.anything())
  })

  it('destroy', async () => {
    const subject = new S3ByInstance({ accessKeyId: 2, secretAccessKey: 3, bucket: 'ok', instanceConfiguration: { key () { return this.id } } })
    const client = subject._buildConfiguration(model).client
    const id = 7777

    client.deleteObject = jest.fn((data, done) => done())

    await subject.destroy(model, { id })

    expect(client.deleteObject).toHaveBeenCalledWith({
      Bucket: subject.options.bucket,
      Key: `projects/${id}.json`
    }, expect.anything())
  })
})
