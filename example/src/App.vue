<template>
    <div id="project-management">
      HI
        <select id="projects">
            <option v-for="project in projects" v-html="project.name" />
        </select>
        <!-- <ul id="tasks">
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
        </ul> -->
    </div>
</template>

<script>
import Superstore from '../../lib/superstore/index.js'

const models = new Superstore({
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
}).models

export default {
  name: 'App',
  data () {
    return {
      tasks: models.tasks,
      projects: models.projects,
      newTask: models.tasks.build()
    }
  },
  mounted() {
    this.tasks.save({ title: 'Create an example' })
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

  @media (prefers-color-scheme: dark) {
    background: #111;
    color: rgba(255, 255, 255, 0.7);
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input {
  border: 1px solid #eee;

  @media (prefers-color-scheme: dark) {
    border-color: #444;
  }
}
</style>
