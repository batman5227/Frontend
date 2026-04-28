export type Filter = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  text: string
  completed: boolean
}

// Backend de DTO
interface TodoResponse {
  id: string
  name: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string | null
}

function mapFromBackend(item: TodoResponse): Todo {
  return {
    id: item.id,
    text: item.name,
    completed: item.isCompleted,
  }
}

export function useTodos() {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const todos = useState<Todo[]>('todos', () => [])
  const filter = useState<Filter>('filter', () => 'all')
  const loading = useState<boolean>('todos-loading', () => false)
  const error = useState<string | null>('todos-error', () => null)

  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<TodoResponse[]>(`${apiBase}/api/todo`)
      todos.value = response.map(mapFromBackend)
    } catch (e: any) {
      error.value = e?.message || 'Erreur lors du chargement des tâches'
    } finally {
      loading.value = false
    }
  }

  const filteredTodos = computed(() => {
    if (filter.value === 'active') return todos.value.filter(t => !t.completed)
    if (filter.value === 'completed') return todos.value.filter(t => t.completed)
    return todos.value
  })

  const activeCount = computed(() => todos.value.filter(t => !t.completed).length)
  const completedCount = computed(() => todos.value.filter(t => t.completed).length)
  const allDone = computed(() => todos.value.length > 0 && activeCount.value === 0)

  async function addTodo(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    try {
      await $fetch<TodoResponse>(`${apiBase}/api/todo`, {
        method: 'POST',
        body: { name: trimmed },
      })
      await fetchTodos()
    } catch (e: any) {
      error.value = e?.message || "Erreur lors de l'ajout"
    }
  }

  async function removeTodo(id: string) {
    try {
      await $fetch(`${apiBase}/api/todo/${id}`, { method: 'DELETE' })
      await fetchTodos()
    } catch (e: any) {
      error.value = e?.message || 'Erreur lors de la suppression'
    }
  }

  async function toggleTodo(id: string) {
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return
    const endpoint = todo.completed ? 'incomplete' : 'complete'
    try {
      await $fetch(`${apiBase}/api/todo/${id}/${endpoint}`, { method: 'PATCH' })
      await fetchTodos()
    } catch (e: any) {
      error.value = e?.message || 'Erreur lors de la mise à jour'
    }
  }

  async function toggleAll() {
    const done = allDone.value
    try {
      await $fetch(`${apiBase}/api/todo/update-all`, {
        method: 'PATCH',
        body: { isCompleted: !done },
      })
      await fetchTodos()
    } catch (e: any) {
      error.value = e?.message || 'Erreur lors de la mise à jour'
    }
  }

  async function updateTodo(id: string, text: string) {
    const trimmed = text.trim()
    if (!trimmed) {
      await removeTodo(id)
      return
    }
    try {
      await $fetch<TodoResponse>(`${apiBase}/api/todo/${id}`, {
        method: 'PUT',
        body: { name: trimmed },
      })
      await fetchTodos()
    } catch (e: any) {
      error.value = e?.message || 'Erreur lors de la mise à jour'
    }
  }

  async function clearCompleted() {
    try {
      await $fetch(`${apiBase}/api/todo/completed`, { method: 'DELETE' })
      await fetchTodos()
    } catch (e: any) {
      error.value = e?.message || 'Erreur lors de la suppression'
    }
  }

  return {
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
  }
}

