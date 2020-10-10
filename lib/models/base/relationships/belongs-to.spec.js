import Superstore from '../../../superstore/index.js'
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
    const project = await superstore.models.projects.save({ id: id })
    const task = await superstore.models.tasks.save({ projectId: id })

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
    const project = await superstore.models.projects.save({ id: id })
    const task = await superstore.models.tasks.save({ customId: id })

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
    const project = await superstore.models.projects.save({ customId: id })
    const task = await superstore.models.tasks.save({ projectId: id })

    expect(task.project).toEqual(project)
  })
})
