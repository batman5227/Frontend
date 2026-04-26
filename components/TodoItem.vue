<script setup lang="ts">
import type { Todo } from '~~/composables/useTodos'

const props = defineProps<{ todo: Todo }>()
const emit = defineEmits<{
  toggle: [id: string]
  remove: [id: string]
  update: [id: string, text: string]
}>()

const editing = ref(false)
const editText = ref('')
const editInput = ref<HTMLInputElement | null>(null)

async function startEdit() {
  editText.value = props.todo.text
  editing.value = true
  await nextTick()
  editInput.value?.focus()
  editInput.value?.select()
}

function commitEdit() {
  if (!editing.value) return
  editing.value = false
  emit('update', props.todo.id, editText.value)
}

function cancelEdit() {
  editing.value = false
  editText.value = props.todo.text
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') commitEdit()
  if (e.key === 'Escape') cancelEdit()
}
</script>

<template>
  <li class="todo-item" :class="{ editing }">
    <!-- Checkbox -->
    <div
      class="todo-check"
      :class="{ checked: todo.completed }"
      @click="emit('toggle', todo.id)"
      role="checkbox"
      :aria-checked="todo.completed"
    >
      <svg viewBox="0 0 12 10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="1.5 5 4.5 8.5 10.5 1.5" />
      </svg>
    </div>

    <!-- Label / Edit input -->
    <input
      v-if="editing"
      ref="editInput"
      v-model="editText"
      class="todo-edit"
      @blur="commitEdit"
      @keydown="onKeydown"
    />
    <span
      v-else
      class="todo-label"
      :class="{ done: todo.completed }"
      @dblclick="startEdit"
    >{{ todo.text }}</span>

    <!-- Delete -->
    <button
      v-if="!editing"
      class="todo-delete"
      @click="emit('remove', todo.id)"
      aria-label="Supprimer"
    >×</button>
  </li>
</template>
