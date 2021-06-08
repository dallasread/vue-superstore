import { reactive, computed } from 'vue'
import { Superstore } from '../../superstore/index.js'

describe('Relationships:BelongsTo', () => {
  it('default configuration', () => {
    const superstore = new Superstore(reactive, computed, {
      task: {
        relationships: {
          project: {
            type: 'BelongsTo'
          }
        }
      },
      project: {}
    })

    const project = superstore.project.create()
    const task = superstore.task.create({ projectId: project.id })

    expect(task.project.toJSON()).toEqual(project.toJSON())
  })

  it('accepts primary key', () => {
    const superstore = new Superstore(reactive, computed, {
      task: {
        relationships: {
          project: {
            type: 'BelongsTo',
            primaryKey: 'customId'
          }
        }
      },
      project: {}
    })

    const project = superstore.project.create()
    const task = superstore.task.create({ customId: project.id })

    expect(task.project.toJSON()).toEqual(project.toJSON())
  })

  it('uses a custom foreign primaryKey', () => {
    const superstore = new Superstore(reactive, computed, {
      task: {
        relationships: {
          project: {
            type: 'BelongsTo'
          }
        }
      },
      project: {
        primaryKey: 'key'
      }
    })

    const project = superstore.project.create({ key: 8374 })
    const task = superstore.task.create({ projectKey: project.key })

    expect(task.project.toJSON()).toEqual(project.toJSON())
  })

  it('uses a custom defaultForeignKey', () => {
    const superstore = new Superstore(reactive, computed, {
      task: {
        relationships: {
          project: {
            type: 'BelongsTo'
          }
        }
      },
      project: {
        defaultForeignKey: 'blah'
      }
    })

    const project = superstore.project.create({ id: 8374 })
    const task = superstore.task.create({ blah: project.id })

    expect(task.project.toJSON()).toEqual(project.toJSON())
  })

  it('accepts foreign key', () => {
    const superstore = new Superstore(reactive, computed, {
      task: {
        relationships: {
          project: {
            type: 'BelongsTo',
            foreignKey: 'customId'
          }
        }
      },
      project: {}
    })

    const id = Math.random()
    const project = superstore.project.create({ customId: id })
    const task = superstore.task.create({ projectId: project.customId })

    expect(task.project.toJSON()).toEqual(project.toJSON())
  })
})
