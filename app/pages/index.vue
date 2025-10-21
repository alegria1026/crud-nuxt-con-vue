<script setup lang="ts">
import type { Post } from '~/composables/usePosts';

const { posts, createPost, updatePost, deletePost } = await usePosts();
const editing = ref<Post | null>(null);
const showModal = ref(false);

const handleCreate = async (title: string, content: string) => {
  await createPost(title, content);
};

const handleStartEdit = (post: Post) => {
  editing.value = { ...post };
  showModal.value = true;
};

const handleSaveEdit = async (title: string, content: string) => {
  if (!editing.value) return;
  await updatePost(editing.value.id, title, content);
  showModal.value = false;
  editing.value = null;
};

const handleCancelEdit = () => {
  showModal.value = false;
  editing.value = null;
};

const handleDelete = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar este post?')) return;
  await deletePost(id);
};
</script>

<template>
  <div class="page">
    <header class="header">
      <h1 class="title">Mi Blog</h1>
      <p class="subtitle">Comparte tus pensamientos con el mundo</p>
    </header>

    <main class="content">
      <section class="create-section">
        <h2 class="section-title">Crear nuevo post</h2>
        <PostForm mode="create" @save="handleCreate" />
      </section>

      <section class="posts-section">
        <div class="section-header">
          <h2 class="section-title">Posts recientes</h2>
          <span v-if="posts && posts.length > 0" class="posts-count">
            {{ posts.length }} {{ posts.length === 1 ? 'post' : 'posts' }}
          </span>
        </div>
        <PostList
            :posts="posts"
            @edit="handleStartEdit"
            @delete="handleDelete"
        />
      </section>
    </main>

    <Modal
        :show="showModal"
        :title="`Editar Post #${editing?.id}`"
        @close="handleCancelEdit"
    >
      <PostForm
          v-if="editing"
          mode="edit"
          :post="editing"
          @save="handleSaveEdit"
          @cancel="handleCancelEdit"
      />
    </Modal>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f9fafb, #ffffff);
}

.header {
  text-align: center;
  padding: 3rem 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.content {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.create-section,
.posts-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.posts-count {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .content {
    padding: 1.5rem 1rem;
    gap: 2rem;
  }

  .section-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 640px) {
  .header {
    padding: 2rem 1rem 1.5rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .content {
    padding: 1rem;
    gap: 1.5rem;
  }
}
</style>