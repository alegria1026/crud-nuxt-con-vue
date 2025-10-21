<script setup lang="ts">
import type { Post } from '~/composables/usePosts';

defineProps<{
  posts: Post[] | null;
}>();

const emit = defineEmits<{
  edit: [post: Post];
  delete: [id: number];
}>();
</script>

<template>
  <section class="list">
    <div v-if="!posts || posts.length === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <p class="empty-text">No hay posts aún</p>
      <p class="empty-subtext">Crea tu primer post arriba</p>
    </div>

    <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @edit="emit('edit', post)"
        @delete="emit('delete', post.id)"
    />
  </section>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #9ca3af;
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.empty-subtext {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

@media (max-width: 640px) {
  .list {
    gap: 0.75rem;
  }

  .empty-state {
    padding: 3rem 1rem;
  }
}
</style>