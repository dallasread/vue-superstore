import { reactive, computed } from 'vue'
import Superstore from '../superstore/index.js'

describe('Relationships:BelongsTo', () => {
  it('default configuration', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {
        relationships: {
          project: {
            type: 'belongsTo'
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
            type: 'belongsTo',
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

  it('accepts foreign key', () => {
    const superstore = new Superstore(reactive, computed, {
      tasks: {
        relationships: {
          project: {
            type: 'belongsTo',
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
