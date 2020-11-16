# Superstore

## Why?

*Intuitive* data relationships for Vue.

## Table of Contents

1. [What's so great about Superstore?](#whats-so-great-about-superstore)
1. [Configuration](#configuration)
1. [Models](#models)
1. [Instance](#instance)
1. [Relationships](#relationships)
   1. [Belongs To](#belongs-to)
   1. [Has Many](#has-many)

### What's so great about Superstore?

With a simple `Superstore` configuration, you can do things like this in your template *with intuitive, **out-of-the-box** database-connected interaction*:

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

### Configuration

```js
import { reactive, computed } from 'vue'
const superstore = new Superstore(reactive, computed, {
  projects: {
    relationships: {
      tasks: { type: 'hasMany' }
    },
    props: ['name'],
    methods: {
      updateName (name) { // Available à la `project.updateName()`
        this.name = name
        this.save()
      }
    }
  },
  tasks: {
    props: {
      title: { type: String, default: '' },
      complete: { type: Boolean, default: false }
    }
  }
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

For the full context, check out the [example](https://github.com/dallasread/vue-superstore/blob/master/example/src/App.vue).

### Models

```js
superstore.projects.build(ATTRIBUTES) // Is not yet reflected in relationships
superstore.projects.create(ATTRIBUTES) // Builds AND saves the instance
superstore.projects.query() // Promise that returns all projects
superstore.projects.findById() // Promise that returns the matching project
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

## Roadmap

- Online / Offline Storage
