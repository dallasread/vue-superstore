# Superstore

{TOC}

## Why?

Intuitive database relationships for Vue.

## Usage

```vue
<template>
    <div id="project-management">
        <select id="projects">
            <option v-for="project in models.projects" v-html="project.name" />
        </select>
        <ul id="tasks">
            <template v-if="project.tasks.loading">
                <li>Loading...</li>
            </template>
            <template v-else>
                <li v-for="task in project.tasks">
                    <input type="checkbox" :checked="task.complete" @change="task.save">
                    <input type="text" v-model="task.title" @blur="task.save">
                    <a @click="task.destroy">x</a>
                </li>
            </template>
            <li>
                <form @submit.prevent="project.tasks.push(newTask); newTask.save(); newTask = tasks.build({ project: project })">
                    <input type="text" v-model="newTask.title">
                </form>
            </li>
        </ul>
    </div>
</template>

<script>
import Superstore from 'vue-superstore';

const store = new Superstore(CONFIG);

export default {
    data () {
        return {
            // use our collection of projects!
            tasks: store.models.tasks,
            projects: store.models.projects,
            newTask: store.models.tasks.build()
        }
    }
}
</script>
```

## Configuration

```js
const CONFIG = new Superstore({
    debug: true,
    // storage: {
    //     local: Local,
    //     remote: Remote
    // },
    models: {
        tasks: new Superstore.BaseModel({
                name: 'task' /* singular */
            }, {
                relationships: {
                    project: {
                        type: 'belongsTo'
                        // primaryKey: 'projectId' (optional)
                    }
                },
                props: { // Vue props
                    title: {
                        type: String,
                        default: 'Untitled'
                    },
                    complete: {
                        type: Boolean,
                        default: false
                    }
                },
                methods: {}, // Vue methods
                computed: {} // Vue computed
            }),
        projects: new Superstore.BaseModel({
                name: 'project' /* singular */
            }, {
                relationships: {
                    tasks: {
                        type: 'hasMany'
                        // foreignKey: 'projectId' optional
                    }
                },
                props: {
                    name: {
                        type: String,
                        default: 'Untitled'
                    }
                }
            })
    }
});
```

## Local Store

```js
import Superstore from 'superstore';

const store = new Superstore.Stores.Local({
    name: 'my-local-store'
});
```
