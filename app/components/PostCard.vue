<script setup lang="ts">
import type { Post } from '~/composables/usePosts';
import { useAuth } from '~/composables/useAuth';

const props = defineProps<{ post: Post }>();
const emit = defineEmits<{ edit: []; delete: [] }>();

const { user } = useAuth();
const isOwner = computed(() => user.value?.id === props.post.user_id);
</script>

<template>
  <article class="card">
    <div class="card-header">
      <h3 class="card-title">{{ post.title }}</h3>
      <time class="card-date">{{ new Date(post.created_at).toLocaleDateString() }}</time>
    </div>

    <p class="card-content">{{ post.content }}</p>

    <!-- Solo mostrar si el post pertenece al usuario -->
    <div v-if="isOwner" class="card-actions">
      <button @click="emit('edit')" class="btn btn-edit" aria-label="Editar post">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Editar
      </button>

      <button @click="emit('delete')" class="btn btn-delete" aria-label="Eliminar post">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
        Eliminar
      </button>
    </div>
  </article>
</template>


<style scoped>
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
  min-width: 0;
  word-break: break-word;
}

.card-date {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
  flex-shrink: 0;
}

.card-content {
  color: #374151;
  line-height: 1.6;
  font-size: 0.9375rem;
  margin: 0 0 1.25rem 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: fit-content;
}

.btn-edit {
  background: #f3f4f6;
  color: #374151;
}

.btn-edit:hover {
  background: #e5e7eb;
}

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fee2e2;
}

@media (max-width: 640px) {
  .card {
    padding: 1.25rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-content {
    font-size: 0.875rem;
  }

  .card-actions {
    gap: 0.5rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    flex: 1;
  }
}
</style>