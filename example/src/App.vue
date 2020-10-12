<template>
    <div id="project-management">
      <ul id="projects">
        <li v-for="project in projects" :key="project.id">
          <a href="javascript:;" @click="selectProject(project)" :class="selectedProject === project ? 'active' : ''">
            {{project.name}}
          </a>
        </li>
        <li>
          <form @submit.prevent="newProject.save(); selectedProject = newProject; newProject = projects.build()">
            <input type="text" v-model="newProject.name" placeholder="+ Add Project">
          </form>
        </li>
      </ul>
      <p>({{selectedProject.tasks.filter((t) => t.complete).length}} / {{selectedProject.tasks.length}} complete)</p>
      <ul v-if="selectedProject" id="tasks">
          <li v-for="task in selectedProject.tasks.filter((t) => !t.complete)" :key="task.id" class="incomplete">
              <input type="checkbox" v-model="task.complete" @change="task.save">
              <input type="text" v-model="task.title" @blur="task.save">
              <a href="javascript:;" @click="task.destroy">x</a>
          </li>
          <li class="incomplete">
              <form @submit.prevent="newTask.projectId = selectedProject.id; newTask.save(); newTask = tasks.build()">
                <input type="checkbox" v-model="newTask.complete" disabled="disabled">
                <input type="text" v-model="newTask.title" placeholder="+ Add Task">
              </form>
          </li>
          <li v-if="selectedProject.tasks.filter((t) => t.complete).length" class="divider"><hr></li>
          <li v-for="task in selectedProject.tasks.filter((t) => t.complete)" :key="task.id" class="complete">
              <input type="checkbox" v-model="task.complete" @change="task.save">
              <input type="text" v-model="task.title" @blur="task.save">
              <a href="javascript:;" @click="task.destroy">x</a>
          </li>
      </ul>
    </div>
</template>

<script>
import Superstore from '../../lib/superstore/index.js'

const superstore = new Superstore({
    models: {
        tasks: new Superstore.Models.Base({
            name: 'task',
            relationships: {
                project: {
                    type: 'belongsTo'
                }
            },
            props: {
              title: {
                type: String,
                default: ''
              },
              complete: {
                type: Boolean,
                default: false
              }
            }
        }),
        projects: new Superstore.Models.Base({
            name: 'project',
            relationships: {
                tasks: {
                    type: 'hasMany'
                }
            },
            props: {
              name: {
                default: ''
              }
            }
        })
    }
}).data

export default {
  name: 'App',
  data () {
    window.app = this;
    window.superstore = superstore

    const task = superstore.tasks.create({
      title: 'Create an example',
      complete: true,
      projectId: superstore.projects.create({ name: 'Project #1' }).id
    })

    return {
      tasks: superstore.tasks,
      projects: superstore.projects,
      selectedProject: task.project,
      newTask: superstore.tasks.build(),
      newProject: superstore.projects.build()
    }
  },
  methods: {
    selectProject(project) {
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
