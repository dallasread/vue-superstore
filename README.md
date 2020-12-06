# Vue Superstore

[![Build Status](https://travis-ci.com/dallasread/vue-superstore.svg?branch=master)](https://travis-ci.com/dallasread/vue-superstore) [![Build Status](https://codeclimate.com/github/dallasread/vue-superstore/test_coverage)](https://api.codeclimate.com/v1/badges/57f6ca23262f56cb04e6/test_coverage)

## Why?

*Intuitive* data relationships for Vue.

## Table of Contents

1. [What's so great about Superstore?](#whats-so-great-about-superstore)
1. [Example Configuration](#example-configuration)
1. [Models](#models)
1. [Instance](#instance)
1. [Relationships](#relationships)
   1. [Belongs To](#belongs-to)
   1. [Has Many](#has-many)

### What's so great about Superstore?

With a simple `Superstore` configuration, you can do powerful things in your Vue component *with intuitive, **out-of-the-box** database-connected interactions*.

OK... so how do I easily create a project?

```js
const project = superstore.projects.create({
  name: 'Project #1'
})
```

And a task?

```js
superstore.tasks.create({
  title: 'Create an example',
  complete: true,
  projectId: project.id
})
```

And how can I access the tasks of a project?

```js
project.tasks
```

And what can I do in a Vue template?

```vue
<li v-for="task in project.tasks">
    <input type="checkbox" :checked="task.complete" @change="task.save()">
    <input type="text" v-model="task.title" @blur="task.save()">
    <a @click="task.destroy()">x</a>
</li>
```

Even better... your data can be backed by one REST API, S3 file, or custom storage solution. Best of all, you can supply multiple stores – useful for syncing data to LocalStorage or adding a backup data storage service.

For a full demo, check out the [example](https://github.com/dallasread/vue-superstore/blob/master/example/src/App.vue) folder. Each file in [lib](https://github.com/dallasread/vue-superstore/blob/master/lib/)'s folders contains detailed front-matter about usage.

### Example Configuration

```js
import { reactive, computed } from 'vue'
const superstore = new Superstore(reactive, computed, {
  projects: {
    relationships: {
      tasks: { type: 'HasMany' }
    },
    props: ['name'],
    computed: {
      username() { // Available via `this.username`
        return this.name.toLowerCase()
      }
    },
    methods: {
      updateName (name) { // Available à la `project.updateName()`
        this.name = name
        this.save()
      }
    }
  },
  tasks: new Superstore.Models.Storage({
    props: {
      title: { type: String, default: '' },
      complete: { type: Boolean, default: false }
    },
    store: { // Store tasks in LocalStorage
      type: 'Local',
      name: 'tasks'
    }
  })
})

const project = superstore.projects.create({
  name: 'Project #1'
})

superstore.tasks.create({
  title: 'Create an example',
  complete: true,
  projectId: project.id
})
```

### Models

There are a few types of models. Explore them in the Each file in [stores](https://github.com/dallasread/vue-superstore/blob/master/lib/stores/) folder.

#### Options

```js
{
    primaryKey: 'id',
    props: ['name'], // Array or Object syntax
    relationships: { // Define model relationships
      tasks: {
        type: 'HasMany'
      }
    },
    computed: { // Define computed properties for each instance
      nickname() {
        return this.name.toLowerCase().slice(0, 3)
      }
    },
    methods: { // Define methods for each instance
      updateName (name) {
        this.name = name
        this.save()
      }
    }
  }
```

#### Methods

```js
superstore.projects.build({}) // Not reflected in relationships, returns instance
superstore.projects.create({}) // Builds AND saves the instance, returns instance
superstore.projects.query() // Promise that returns all projects
superstore.projects.find(123) // Promise that returns a single instance
```

#### Custom Model

Note: It is possible to `class MySpecialModel extends Superstore.Models.Base ...` and supply it in the `Superstore` configuration:

```js
new Superstore(reactive, computed, {
  projects: new MySpecialModel()
})
```

### Instance

```js
project.save() // Saves the project (eg. usable by a hasMany, resets changeset)
project.destroy() // Removes the project
project.toJSON() // Maps the project to JSON
project.changes() // Lists the changes to the project since last save
project.hasChanges() // If the project has unsaved changes
project.rollback() // Reset project to the last saved state
```

### Relationships

#### Belongs To

Options supported:

```js
foreignKey
primaryKey
```

#### Has Many

Options supported:

```js
foreignKey
primaryKey
```
