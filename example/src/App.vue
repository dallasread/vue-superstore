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
        <form @submit.prevent="newProject.save(); selectProject(newProject); newProject = projects.build()">
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
          @blur="task.save()"
        >
        <a
          href="javascript:;"
          @click="task.destroy()"
        >x</a>
      </li>
      <li class="incomplete">
        <form @submit.prevent="newTask.projectId = selectedProject.id; newTask.save(); newTask = tasks.build()">
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
          @change="task.save()"
        >
        <input
          v-model="task.title"
          type="text"
          @blur="task.save()"
        >
        <a
          href="javascript:;"
          @click="task.destroy()"
        >x</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import Superstore from '../../lib/superstore/index.js'

const models = window.models = new Superstore(reactive, computed, {
  projects: {
    relationships: {
      tasks: {
        type: 'hasMany'
      }
    },
    props: ['name'],
    methods: {
      updateName (name) {
        this.name = name
        this.save()
      }
    }
  },
  tasks: {
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
  }
})

export default {
  name: 'App',
  data () {
    const project = models.projects.create({
      name: 'Project #1'
    })

    models.tasks.create({
      title: 'Create an example',
      complete: true,
      projectId: project.id
    })

    return {
      tasks: models.tasks,
      projects: models.projects,
      selectedProject: project,
      newTask: models.tasks.build(),
      newProject: models.projects.build()
    }
  },
  computed: {
    incompletedTasks () {
      return this.selectedProject.tasks.filter((t) => !t.complete)
    },
    completedTasks () {
      return this.selectedProject.tasks.filter((t) => t.complete)
    }
  },
  methods: {
    selectProject (project) {
      if (this.selectedProject.id === project.id) {
        const name = prompt('What is this project called?', project.name)

        if (name) {
          project.updateName(name)
        }
      } else {
        this.selectedProject = project
      }
    }
  }
}
</script>

<style lang="css">
@import "./style.css"
</style>
