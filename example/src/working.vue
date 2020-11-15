<template>
  <div id="project-management">
    <ul id="projects">
      <li
        v-for="project in projects"
        :key="project.id"
      >
        <a
          href="javascript:;"
          :class="selectedProject.id === project.id ? 'active' : ''"
          @click="selectProject(project)"
        >
          {{ project.name }}
        </a>
      </li>
      <li>
        <form @submit.prevent="projects.push(newProject); selectProject(newProject); newProject = projects.build({})">
          <input
            v-model="newProject.name"
            type="text"
            placeholder="+ Add Project"
          >
        </form>
      </li>
    </ul>
    <p v-if="selectedProject">
      ({{ completedTasks.length }} / {{ selectedProject.tasks.length }} complete)
    </p>
    <ul
      v-if="selectedProject"
      id="tasks"
    >
      <li
        v-for="task in incompletedTasks"
        :key="task.id"
        class="incomplete"
      >
        <input
          type="checkbox"
          @change="task.complete = !task.complete"
        >
        <input
          v-model="task.title"
          type="text"
          @blur="task.save"
        >
        <a
          href="javascript:;"
          @click="task.destroy"
        >x</a>
      </li>
      <li class="incomplete">
        <form @submit.prevent="newTask.projectId = selectedProject.id; tasks.push(newTask); newTask = tasks.build({})">
          <input
            v-model="newTask.complete"
            type="checkbox"
            disabled="disabled"
          >
          <input
            v-model="newTask.title"
            type="text"
            placeholder="+ Add Task"
          >
        </form>
      </li>
      <li
        v-if="completedTasks.length"
        class="divider"
      >
        <hr>
      </li>
      <li
        v-for="task in completedTasks"
        :key="task.id"
        class="complete"
      >
        <input
          v-model="task.complete"
          type="checkbox"
          @change="task.save"
        >
        <input
          v-model="task.title"
          type="text"
          @blur="task.save"
        >
        <a
          href="javascript:;"
          @click="task.destroy"
        >x</a>
      </li>
    </ul>
  </div>
</template>

<script>
// import Superstore from '../../lib/superstore/index.js'
// import baseModel from '../../lib/models/base/index.js'
// import { ref, reactive, computed } from 'vue'

import { computed, reactive } from 'vue'
import utils from '../../lib/utils/index.js'

function initializeModel (models, modelName, options) {
  const model = models[modelName]

  model.build = function (attrs) {
    const instance = {
      id: Math.random()
    }

    for (var i = options.props.length - 1; i >= 0; i--) {
      instance[options.props[i]] = attrs[options.props[i]]
    }

    for (var key in options.relationships) {
      instance[key] = computed(function () {
        return models[key].filter((item) => {
          return item[`${utils.singularize(modelName)}Id`] === instance.id
        })
      })
    }

    return instance
  }
}

function fake (options) {
  const models = {}

  let key
  let model

  for (key in options) {
    models[key] = reactive([])
  }

  for (key in models) {
    initializeModel(models, key, options[key])
  }

  return models
}

const superstore = fake({
  tasks: {
    props: ['title']
  },
  projects: {
    props: ['name'],
    relationships: {
      tasks: {
        type: 'hasMany'
      }
    }
  }
})

const tasks = superstore.tasks
const projects = superstore.projects

// const models = new Superstore({
//   models: {
//     tasks: baseModel({
//       relationships: {
//         project: {
//           type: 'belongsTo'
//         }
//       },
//       props: {
//         title: {
//           type: String,
//           default: ''
//         },
//         complete: {
//           type: Boolean,
//           default: false
//         }
//       }
//     }),
//     projects: baseModel({
//       relationships: {
//         tasks: {
//           type: 'hasMany'
//         }
//       },
//       props: {
//         name: {
//           default: ''
//         }
//       }
//     })
//   }
// }).models

export default {
  name: 'App',
  data () {
    // window.app = this
    // window.models = models

    // const project = models.projects.create({ name: 'Project #1' })
    // const task = models.tasks.create({
    //   title: 'Create an example',
    //   complete: true,
    //   projectId: project.id
    // })
    // const selectedProject = project
    // window.project = project

    // return {
    //   projects: models.projects,
    //   tasks: models.tasks,
    //   selectedProject: selectedProject,
    //   newTask: models.tasks.build({}),
    //   newProject: models.projects.build({}),
    //   completedTasks: models.tasks,
    //   incompletedTasks: models.tasks
    //   // incompletedTasks: computed(() => {
    //   //   return selectedProject.tasks.filter((t) => !t.complete)
    //   // }),
    //   // completedTasks: computed(() => {
    //   //   return selectedProject.tasks.filter((t) => t.complete)
    //   // })
    // }

    const project = projects.build({ name: 'Project #1' })
    projects.push(project)
    tasks.push({
      projectId: project.id,
      title: 'Task #1',
      complete: false
    })

    return {
      projects: projects,
      tasks: tasks,
      selectedProject: project,
      newTask: tasks.build({}),
      newProject: projects.build({})
    }
  },
  computed: {
    completedTasks () {
      return this.selectedProject.tasks.filter((t) => t.complete)
    },
    incompletedTasks () {
      return this.selectedProject.tasks.filter((t) => !t.complete)
    }
  },
  methods: {
    selectProject (project) {
      if (this.selectedProject === project) {
        project.name = prompt('What is this project called?')
        project.save()
      } else {
        this.selectedProject = project
      }
    }
  }
}
</script>

<style lang="css">
/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video,
input, textarea, select {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    color: inherit;
    outline: none;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
    display: block;
}
body {
    line-height: 1;
}
ol, ul {
    list-style: none;
}
blockquote, q {
    quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
    content: '';
    content: none;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
a {
    color: inherit;
    text-decoration: inherit;
    text-transform: inherit;
    display: inline-block;
}
img {
    max-width: 100%;
}

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

html, body {
  color: #2c3e50;
  padding: 20px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#projects {
  background: #eee;
}

#projects:after {
  content: '';
  clear: both;
  display: block;
}

#projects li {
  float: left;
}

#projects a, #projects input {
  border-right: 1px solid #ddd;
  display: block;
  padding: 10px 20px;
  line-height: 1;
}

#projects input {
  padding: 7px 10px;
  width: 8em;
}

#projects a.active {
  background: #777;
  color: #eee;
}

#tasks li.incomplete {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

#tasks li.divider {
  margin-top: -9px;
}

#tasks li.complete {
  font-size: 80%;
  padding: 5px 0;
  color: #777;
}

#tasks hr {
  border: 0;
  background: #ccc;
  height: 1px;
}

#tasks input[type="checkbox"] {
  margin-right: 10px;
}

p {
  font-weight: bold;
  padding: 8px;
  background: #777;
  font-size: 80%;
  color: #eee;
  text-align: center;
}
</style>
