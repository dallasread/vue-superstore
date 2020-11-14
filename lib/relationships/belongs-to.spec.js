import Superstore from '../superstore/index.js'
import belongsTo from './belongs-to.js'

describe('Relationships:BelongsTo', () => {
  it('default configuration', async () => {
    const superstore = new Superstore({
      models: {
        tasks: new Superstore.Models.Base({
          relationships: {
            project: {
              type: 'belongsTo'
            }
          }
        }),
        projects: new Superstore.Models.Base({})
      }
    })

    const id = Math.random()
    const project = superstore.data.projects.build({ id: id })
    const task = superstore.data.tasks.build({ projectId: project.id })

    await project.save()
    await task.save()

    expect(task.project).toEqual(project)
  })

  it('accepts primary key', async () => {
    const superstore = new Superstore({
      models: {
        tasks: new Superstore.Models.Base({
          relationships: {
            project: {
              type: 'belongsTo',
              primaryKey: 'customId'
            }
          }
        }),
        projects: new Superstore.Models.Base({})
      }
    })

    const id = Math.random()
    const project = await superstore.data.projects.save({ id: id })
    const task = await superstore.data.tasks.save({ customId: id })

    expect(task.project).toEqual(project)
  })

  it('accepts foreign key', async () => {
    const superstore = new Superstore({
      models: {
        tasks: new Superstore.Models.Base({
          relationships: {
            project: {
              type: 'belongsTo',
              foreignKey: 'customId'
            }
          }
        }),
        projects: new Superstore.Models.Base({})
      }
    })

    const id = Math.random()
    const project = await superstore.data.projects.save({ customId: id })
    const task = await superstore.data.tasks.save({ projectId: id })

    expect(task.project).toEqual(project)
  })
})
