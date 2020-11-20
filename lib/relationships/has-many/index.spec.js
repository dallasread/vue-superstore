import { reactive, computed } from 'vue'
import Superstore from '../../superstore/index.js'

describe('Relationships:HasMany', () => {
  it('default configuration', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {},
      projects: {
        relationships: {
          tasks: {
            type: 'HasMany'
          }
        }
      }
    })

    const project = superstore.projects.create()
    const task = superstore.tasks.create({ projectId: project.id })

    expect(project.tasks.value.length).toBe(1)
    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })

  it('primary key', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {},
      projects: {
        relationships: {
          tasks: {
            type: 'HasMany',
            primaryKey: 'customId'
          }
        }
      }
    })

    const id = Math.random()
    const project = superstore.projects.create({ customId: id })
    const task = superstore.tasks.create({ projectId: id })

    expect(project.tasks.value.length).toBe(1)
    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })

  it('uses a custom primaryKey', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {},
      projects: {
        relationships: {
          tasks: {
            type: 'HasMany',
            primaryKey: 'customId'
          }
        }
      }
    })

    const project = superstore.projects.create({ id: Math.random() })
    const task = superstore.tasks.create({ customId: project.id })

    expect(project.tasks.value.length).toBe(1)
    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })

  it('uses the default custom foreign primaryKey', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {
        primaryKey: 'key'
      },
      projects: {
        relationships: {
          tasks: {
            type: 'HasMany'
          }
        }
      }
    })

    const project = superstore.projects.create()
    const task = superstore.tasks.create({ projectId: project.id })

    expect(project.tasks.value.length).toBe(1)
    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })

  it('foreign key', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {},
      projects: {
        relationships: {
          tasks: {
            type: 'HasMany',
            foreignKey: 'customId'
          }
        }
      }
    })

    const project = superstore.projects.create({ id: Math.random() })
    const task = superstore.tasks.create({ customId: project.id })

    expect(project.tasks.value.length).toBe(1)
    expect(project.tasks.value[0].toJSON()).toEqual(task.toJSON())
  })
})
