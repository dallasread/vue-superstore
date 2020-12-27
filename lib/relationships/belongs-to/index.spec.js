import { reactive, computed } from 'vue'
import { Superstore } from '../../superstore/index.js'

describe('Relationships:BelongsTo', () => {
  it('default configuration', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {
        relationships: {
          project: {
            type: 'BelongsTo'
          }
        }
      },
      projects: {}
    })

    const project = superstore.projects.create()
    const task = superstore.tasks.create({ projectId: project.id })

    expect(task.project.value.toJSON()).toEqual(project.toJSON())
  })

  it('accepts primary key', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {
        relationships: {
          project: {
            type: 'BelongsTo',
            primaryKey: 'customId'
          }
        }
      },
      projects: {}
    })

    const project = superstore.projects.create()
    const task = superstore.tasks.create({ customId: project.id })

    expect(task.project.value.toJSON()).toEqual(project.toJSON())
  })

  it('uses a custom foreign primaryKey', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {
        relationships: {
          project: {
            type: 'BelongsTo'
          }
        }
      },
      projects: {
        primaryKey: 'key'
      }
    })

    const project = superstore.projects.create({ key: 8374 })
    const task = superstore.tasks.create({ projectKey: project.key })

    expect(task.project.value.toJSON()).toEqual(project.toJSON())
  })

  it('uses a custom defaultForeignKey', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {
        relationships: {
          project: {
            type: 'BelongsTo'
          }
        }
      },
      projects: {
        defaultForeignKey: 'blah'
      }
    })

    const project = superstore.projects.create({ id: 8374 })
    const task = superstore.tasks.create({ blah: project.id })

    expect(task.project.value.toJSON()).toEqual(project.toJSON())
  })

  it('accepts foreign key', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {
        relationships: {
          project: {
            type: 'BelongsTo',
            foreignKey: 'customId'
          }
        }
      },
      projects: {}
    })

    const id = Math.random()
    const project = superstore.projects.create({ customId: id })
    const task = superstore.tasks.create({ projectId: project.customId })

    expect(task.project.value.toJSON()).toEqual(project.toJSON())
  })
})
