import { reactive, computed } from 'vue'
import { Superstore } from '../../superstore/index.js'

describe('Relationships:HasMany', () => {
  it('default configuration', () => {
    const superstore = new Superstore(reactive, computed, {
      task: {},
      project: {
        relationships: {
          tasks: {
            type: 'HasMany'
          }
        }
      }
    })

    const project = superstore.project.create()
    const task = superstore.task.create({ projectId: project.id })

    expect(project.tasks.value.length).toEqual(1)
    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })

  it('primary key', () => {
    const superstore = new Superstore(reactive, computed, {
      task: {},
      project: {
        relationships: {
          tasks: {
            type: 'HasMany',
            primaryKey: 'customId'
          }
        }
      }
    })

    const id = Math.random()
    const project = superstore.project.create({ customId: id })
    const task = superstore.task.create({ projectId: id })

    expect(project.tasks.value.length).toEqual(1)
    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })

  it('uses a custom primaryKey', () => {
    const superstore = new Superstore(reactive, computed, {
      task: {},
      project: {
        relationships: {
          tasks: {
            type: 'HasMany',
            primaryKey: 'customId'
          }
        }
      }
    })

    const project = superstore.project.create({ id: Math.random() })
    const task = superstore.task.create({ customId: project.id })

    expect(project.tasks.value.length).toEqual(1)
    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })

  it('uses the default custom foreign primaryKey', () => {
    const superstore = new Superstore(reactive, computed, {
      task: {
        primaryKey: 'key'
      },
      project: {
        relationships: {
          tasks: {
            type: 'HasMany'
          }
        }
      }
    })

    const project = superstore.project.create()
    const task = superstore.task.create({ projectId: project.id })

    expect(project.tasks.value.length).toEqual(1)
    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })

  it('foreign key', () => {
    const superstore = new Superstore(reactive, computed, {
      task: {},
      project: {
        relationships: {
          tasks: {
            type: 'HasMany',
            foreignKey: 'customId'
          }
        }
      }
    })

    const project = superstore.project.create({ id: Math.random() })
    const task = superstore.task.create({ customId: project.id })

    expect(project.tasks.value.length).toEqual(1)
    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })
})
