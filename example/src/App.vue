<template>
  <div
    v-if="selectedProject"
    id="project-management"
  >
    <ul id="projects">
      <li
        v-for="project in projects.data"
        :key="project.id"
      >
        <a
          href="javascript:;"
          :class="selectedProject && selectedProject.id === project.id ? 'active' : ''"
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
    <p>
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

// const store = {
//   type: 'Local',
//   name: 'my-local-storage'
// }

const models = window.models = new Superstore(reactive, computed, {
  projects: {
    // store,
    props: ['name'],
    relationships: {
      tasks: {
        type: 'HasMany'
      }
    },
    methods: {
      updateName (name) {
        this.name = name
        this.save()
      }
    }
  },
  tasks: {
    // store,
    props: {
      title: {
        type: String,
        default: ''
      },
      complete: {
        type: Boolean,
        default: false
      }
    },
    relationships: {
      project: {
        type: 'BelongsTo'
      }
    }
  }
})

export default {
  name: 'App',
  data () {
    return {
      tasks: models.tasks,
      projects: models.projects,
      selectedProject: null,
      newTask: models.tasks.build(),
      newProject: models.projects.build()
    }
  },
  computed: {
    incompletedTasks () {
      return this.selectedProject ? this.selectedProject.tasks.filter((t) => !t.complete) : []
    },
    completedTasks () {
      return this.selectedProject ? this.selectedProject.tasks.filter((t) => t.complete) : []
    }
  },
  mounted () {
    models.projects.query().then(() => {
      models.tasks.query().then(() => {
        if (!models.projects.data.length) {
          this.seed()
        }

        this.selectedProject = models.projects.data[0]
      })
    })
  },
  methods: {
    seed () {
      const project = models.projects.create({
        name: 'Project #1'
      })

      models.tasks.create({
        title: 'Create an example',
        complete: true,
        projectId: project.id
      })
    },

    selectProject (project) {
      if (this.selectedProject && this.selectedProject.id === project.id) {
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
