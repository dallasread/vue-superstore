# Superstore

## Why?

*Intuitive* data relationships for Vue.

## Table of Contents

1. [What's so great about Superstore?](#whats-so-great-about-superstore)
1. [Instance](#instance)
   1. Props
   1. Methods
   1. Computed
   1. Mixins
1. [Models](#models)
   1. [BaseModel](#base-model)
   1. [StorageModel](#storage-model)
1. [Relationships](#relationships)
   1. [Belongs To](#belongs-to)
   1. [Has Many](#has-many)
1. [Stores](#stores)
   1. [Object](#object)
   1. [Local](#local)
   1. [Rest](#rest)
1. [Logger](#logger)

### What's so great about Superstore?

Once you tell `Superstore` about your collections and how they relate, you can start using your records. For example, you can do things like this *with intuitive, out-of-the-box database interaction*:

```vue
<template>
    <div id="project-management">
        <select id="projects">
            <option v-for="project in projects" v-html="project.name" />
        </select>
        <ul id="tasks">
            <li v-for="task in project.tasks">
                <input type="checkbox" :checked="task.complete" @change="task.save">
                <input type="text" v-model="task.title" @blur="task.save">
                <a @click="task.destroy">x</a>
            </li>
            <li>
                <form @submit.prevent="newTask.save(); newTask = tasks.build({ project: project })">
                    <input type="text" v-model="newTask.title">
                </form>
            </li>
        </ul>
        <p>
            <span v-if="project.tasks.loading?">Loading...</span>
            <span v-else>Loaded.</span>
        </p>
    </div>
</template>
```

And the setup for this particular Vue component couldn't be any more simple:

```js
import Superstore from 'vue-superstore'
import CONFIG from './config'

const models = new Superstore(CONFIG).models

export default {
  data () {
    return {
      tasks: models.tasks,
      projects: models.projects,
      newTask: models.tasks.build()
    }
  }
}
```

What does the `CONFIG` look like?

```js
const CONFIG = new Superstore({
      models: {
          tasks: new Superstore.Models.Base({
              name: 'task'
          }, {
              relationships: {
                  project: {
                      type: 'belongsTo'
                  }
              },
              props: ['title', 'complete'] // Vue props!
          }),
          projects: new Superstore.Models.Base({
              name: 'project'
          }, {
              relationships: {
                  tasks: {
                      type: 'hasMany'
                  }
              },
              props: ['name']
          })
      }
  });
```

### Instance

Records are just normal Vue objects, so you can attach `computed` properties, `mixins`, `methods`, or `props` – and they work just as you'd expect!

#### Computed
#### Mixins
#### Methods
#### Props

### Models

### Relationships
#### Belongs To
#### Has Many

project.tasks.saved
project.tasks.loading?

### Stores

You can supply an offline AND online storage and they work together!

#### Object

```js
import Superstore from 'superstore';

const store = new Superstore.Stores.Object();
```

#### Local

```js
import Superstore from 'superstore';

const store = new Superstore.Stores.Local({
    name: 'my-local-store'
});
```

#### Rest

```js
import Superstore from 'superstore';

const store = new Superstore.Stores.Rest({
    url: 'https://super.store/api'
});
```

### Development

#### Logger
