<script setup lang="ts">
import type { Post } from '~/composables/usePosts';

const props = defineProps<{
  post?: Post | null;
  mode: 'create' | 'edit';
}>();

const emit = defineEmits<{
  save: [title: string, content: string];
  cancel: [];
}>();

const title = ref(props.post?.title || '');
const content = ref(props.post?.content || '');

watch(() => props.post, (newPost) => {
  title.value = newPost?.title || '';
  content.value = newPost?.content || '';
});

const handleSave = () => {
  if (!title.value.trim() || !content.value.trim()) return;
  emit('save', title.value, content.value);
  if (props.mode === 'create') {
    title.value = '';
    content.value = '';
  }
};

const isValid = computed(() => title.value.trim() && content.value.trim());
</script>

<template>
  <form @submit.prevent="handleSave" class="form">
    <div class="form-group">
      <label for="title" class="form-label">Título</label>
      <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Ingresa el título..."
          class="form-input"
          required
      />
    </div>

    <div class="form-group">
      <label for="content" class="form-label">Contenido</label>
      <textarea
          id="content"
          v-model="content"
          placeholder="Escribe tu contenido aquí..."
          class="form-textarea"
          rows="6"
          required
      />
    </div>

    <div class="form-actions">
      <button
          type="submit"
          class="btn btn-primary"
          :disabled="!isValid"
      >
        {{ mode === 'create' ? 'Publicar' : 'Guardar cambios' }}
      </button>

      <button
          v-if="mode === 'edit'"
          type="button"
          @click="emit('cancel')"
          class="btn btn-secondary"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9375rem;
  color: #111827;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.6;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #111827;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1f2937;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 640px) {
  .form-input,
  .form-textarea {
    font-size: 16px; /* Previene zoom en iOS */
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>