import Superstore from '../superstore/index.js'
import hasMany from './belongs-to.js'

describe('Relationships:HasMany', () => {
  it('default configuration', async () => {
    const superstore = new Superstore({
      models: {
        tasks: new Superstore.Models.Base({}),
        projects: new Superstore.Models.Base({
          relationships: {
            tasks: {
              type: 'hasMany'
            }
          }
        })
      }
    })

    const project = await superstore.models.projects.create({})
    const task = await superstore.models.tasks.create({ projectId: project.id })

    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })

  it('primary key', async () => {
    const superstore = new Superstore({
      models: {
        tasks: new Superstore.Models.Base({}),
        projects: new Superstore.Models.Base({
          relationships: {
            tasks: {
              type: 'hasMany',
              primaryKey: 'customId'
            }
          }
        })
      }
    })

    const id = Math.random()
    const project = await superstore.models.projects.save({ customId: id })
    const task = await superstore.models.tasks.save({ projectId: id })

    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })

  it('foreign key', async () => {
    const superstore = new Superstore({
      models: {
        tasks: new Superstore.Models.Base({}),
        projects: new Superstore.Models.Base({
          relationships: {
            tasks: {
              type: 'hasMany',
              foreignKey: 'customId'
            }
          }
        })
      }
    })

    const id = Math.random()
    const project = await superstore.models.projects.save({ id: id })
    const task = await superstore.models.tasks.save({ customId: id })

    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })
})
