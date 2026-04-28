<script setup lang="ts">
import type { Filter } from '~~/composables/useTodos'

const {
  todos,
  filter,
  filteredTodos,
  activeCount,
  completedCount,
  allDone,
  loading,
  error,
  addTodo,
  removeTodo,
  toggleTodo,
  toggleAll,
  updateTodo,
  clearCompleted,
  fetchTodos,
} = useTodos()

onMounted(() => {
  fetchTodos()
})

const newTodo = ref('')

function handleNewTodo(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    addTodo(newTodo.value)
    newTodo.value = ''
  }
}

const filters: { label: string; value: Filter }[] = [
  { label: 'Tout', value: 'all' },
  { label: 'Actif', value: 'active' },
  { label: 'Terminé', value: 'completed' },
]
</script>

<template>
  <div class="app-wrapper">
    <!-- Header -->
    <header class="app-header">
      <h1>todos</h1>
      <p>Double-clic sur une tâche pour éditer</p>
    </header>

    <!-- Status -->
    <div v-if="loading" class="status-message loading">
      Chargement des tâches…
    </div>
    <div v-else-if="error" class="status-message error">
      {{ error }}
    </div>

    <!-- Card -->
    <div class="todo-card">
      <!-- New todo row -->
      <div class="todo-input-row">
        <button
          v-if="todos.length > 0"
          class="toggle-all-btn"
          :class="{ 'all-done': allDone }"
          @click="toggleAll"
          :title="allDone ? 'Tout décocher' : 'Tout cocher'"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="2 8 6 12 14 4" />
          </svg>
        </button>

        <input
          v-model="newTodo"
          class="new-todo"
          placeholder="Quelle est votre prochaine tâche ?"
          @keydown="handleNewTodo"
          autofocus
          aria-label="Nouvelle tâche"
        />
      </div>

      <!-- Todo list -->
      <TransitionGroup v-if="filteredTodos.length > 0" name="list" tag="ul" class="todo-list">
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          @toggle="toggleTodo"
          @remove="removeTodo"
          @update="updateTodo"
        />
      </TransitionGroup>

      <!-- Empty state -->
      <div v-else-if="todos.length === 0" class="empty-state">
        <span>✦</span>
        Aucune tâche pour l'instant.<br>Commencez à taper ci-dessus.
      </div>
      <div v-else class="empty-state">
        <span>✓</span>
        Aucune tâche dans cette vue.
      </div>

      <!-- Footer -->
      <footer v-if="todos.length > 0" class="todo-footer">
        <span class="items-left">
          <strong>{{ activeCount }}</strong>
          {{ activeCount === 1 ? 'tâche restante' : 'tâches restantes' }}
        </span>

        <nav class="filters" aria-label="Filtrer les tâches">
          <button
            v-for="f in filters"
            :key="f.value"
            class="filter-btn"
            :class="{ active: filter === f.value }"
            @click="filter = f.value"
          >
            {{ f.label }}
          </button>
        </nav>

        <button
          v-if="completedCount > 0"
          class="clear-btn"
          @click="clearCompleted"
        >
          Effacer ({{ completedCount }})
        </button>
      </footer>
    </div>

    <!-- Credits -->
    <p class="credits">
      Fait avec du Nuxt 3 par Yann· Inspiré de
      <a href="https://todomvc.com" target="_blank" rel="noopener">TodoMVC</a>
    </p>
  </div>
</template>
