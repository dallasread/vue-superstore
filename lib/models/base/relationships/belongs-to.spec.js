import belongsTo from './belongs-to.js'

describe('Relationships:BelongsTo', () => {
  // it('default configuration', () => {
  //   const superstore = new Superstore({
  //     models: {
  //       tasks: {
  //         relationships: {
  //           project: {
  //             type: 'belongsTo'
  //           }
  //         }
  //       },
  //       projects: {}
  //     }
  //   })

  //   const project = superstore.models.projects.build({ id: 7 })
  //   const task = superstore.models.projects.build({ id: 7, projectId: 7 })

  //   expect(task.project).toEqual(project)
  // })

  // it('primary key', () => {
  //   const subject = belongsTo(superstore, 'project', { primaryKey: 'testId' }, {})
  //   expect(subject.instancePrototype.relationships).toEqual(relationships)
  // })
})
