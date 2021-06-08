# Vue Superstore

[![Travis CI](https://travis-ci.com/dallasread/vue-superstore.svg?branch=master)](https://travis-ci.com/dallasread/vue-superstore) 
[![Test Coverage](https://api.codeclimate.com/v1/badges/57f6ca23262f56cb04e6/test_coverage)](https://codeclimate.com/github/dallasread/vue-superstore/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/57f6ca23262f56cb04e6/maintainability)](https://codeclimate.com/github/dallasread/vue-superstore/maintainability)

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
1. [Stores](#stores)

### What's so great about Superstore?

With a simple `Superstore` configuration, you can do powerful things in your Vue component *with intuitive, **out-of-the-box** database-connected interactions*.

OK... so how do I easily create a project?

```js
const project = superstore.project.create({
  name: 'Project #1'
})
```

And a task?

```js
superstore.task.create({
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

For a full demo, check out the [example](https://github.com/dallasread/vue-superstore/blob/master/example/src/App.vue) folder. In addition, each file in [lib](https://github.com/dallasread/vue-superstore/blob/master/lib/)'s folders contains detailed front-matter about usage.

### Example Configuration

```js
import { reactive, computed } from 'vue'
const superstore = new Superstore(reactive, computed, {
  project: {
    relationships: {
      tasks: { 
        type: 'HasMany' 
      }
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
  task: new Superstore.Models.Storage({
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

const project = superstore.project.create({
  name: 'Project #1'
})

superstore.task.create({
  title: 'Create an example',
  complete: true,
  projectId: project.id
})
```

### Models

There are a few types of models. You can explore each of them in the [models](https://github.com/dallasread/vue-superstore/blob/master/lib/models/) folder.

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
superstore.project.build({}) // Relationships are not reflected, returns instance
superstore.project.create({}) // Builds AND saves the instance, returns instance
superstore.project.query() // Promise that returns all projects
superstore.project.find(123) // Promise that returns a single instance
```

In some cases, it is helpful to be able to create items in memory only, *without* persisting to stores:

```
superstore.project.inMemory.create()
```

### Instance

An Instance is the representation of the instance of a model (eg. record). There are a few convenience methods on each Instance.

#### Methods

```js
project.save() // Saves the project (eg. usable by a hasMany, resets project's changes)
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
foreignModel: [String, optional] The linked model's type
primaryKey: [String, optional] The primary model's attribute
foreignKey: [String, optional] The foreign model's attribute
```

#### Has Many

Options supported:

```js
foreignModel: [String, optional] The linked model's type
primaryKey: [String, optional] The primary model's attribute
foreignKey: [String, optional] The foreign model's attribute
```

### Stores

A Store is the adapter that connects to your data storage.

This configuration would store all "accounts" in a single `.json`:

```
new Superstore({
  account: {
    store: {
      type: 's3',
      accessKeyId: '',
      secretAccessKey: '',
      bucket: '',
      endpoint: 'https://s3.us-east-1.amazonaws.com',
      apiVersion: 'latest',
      maxRetries: 1
      extension: '.json'
    }
  }
})
```

You can explore each of them in the [stores](https://github.com/dallasread/vue-superstore/blob/master/lib/stores/) folder.

- [local](https://github.com/dallasread/vue-superstore/blob/master/lib/stores/local/index.js)
- [rest](https://github.com/dallasread/vue-superstore/blob/master/lib/stores/rest/index.js)
- [s3](https://github.com/dallasread/vue-superstore/blob/master/lib/stores/s3/index.js)
- [s3-by-instance](https://github.com/dallasread/vue-superstore/blob/master/lib/stores/s3-by-instance/index.js)
