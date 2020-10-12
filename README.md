# Superstore

## Why?

*Intuitive* data relationships for Vue.

## Table of Contents

1. [What's so great about Superstore?](#whats-so-great-about-superstore)
1. [Instance](#instance)
   1. [Props](#props)
   1. [Methods](#methods)
   1. [Computed](#computed)
   1. [Mixins](#mixins)
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

With a simple `Superstore` configuration, you can do things like this in your template *with intuitive, **out-of-the-box** database-connected interaction*:

```
<li v-for="task in project.tasks">
    <input type="checkbox" :checked="task.complete" @change="task.save">
    <input type="text" v-model="task.title" @blur="task.save">
    <a @click="task.destroy">x</a>
</li>
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

## Tasks

- Offline support
- S3 support
- Multi-store support
- Scopes
