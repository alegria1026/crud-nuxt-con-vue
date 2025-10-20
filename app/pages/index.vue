<script setup lang="ts">
type Post = { id: number; title: string; content: string; created_at: string };

const newTitle = ref('');
const newContent = ref('');
const editing = ref<Post | null>(null);

const { data: posts, refresh } = await useFetch<Post[]>('/api/posts');

async function createPost() {
  if (!newTitle.value || !newContent.value) return;
  await $fetch('/api/posts', { method: 'POST', body: { title: newTitle.value, content: newContent.value } });
  newTitle.value = ''; newContent.value = '';
  await refresh();
}

function startEdit(p: Post) {
  editing.value = { ...p };
}

async function saveEdit() {
  if (!editing.value) return;
  const { id, title, content } = editing.value;
  await $fetch('/api/posts', { method: 'PUT', query: { id }, body: { title, content } });
  editing.value = null;
  await refresh();
}

async function del(id: number) {
  if (!confirm('¿Eliminar este post?')) return;
  await $fetch('/api/posts', { method: 'DELETE', query: { id } });
  await refresh();
}
</script>

<template>
  <div class="mx-auto max-w-2xl p-6 space-y-8">
    <h1 class="text-2xl font-bold">Blog (CRUD mínimo)</h1>

    <!-- Crear -->
    <section class="space-y-2 border p-4 rounded-lg">
      <h2 class="font-semibold">Crear post</h2>
      <input v-model="newTitle" placeholder="Título" class="w-full border rounded p-2" />
      <textarea v-model="newContent" placeholder="Contenido" class="w-full border rounded p-2 h-24" />
      <button @click="createPost" class="bg-black text-white px-3 py-2 rounded">Guardar</button>
    </section>

    <!-- Editar -->
    <section v-if="editing" class="space-y-2 border p-4 rounded-lg">
      <h2 class="font-semibold">Editar post #{{ editing!.id }}</h2>
      <input v-model="editing!.title" class="w-full border rounded p-2" />
      <textarea v-model="editing!.content" class="w-full border rounded p-2 h-24" />
      <div class="flex gap-2">
        <button @click="saveEdit" class="bg-black text-white px-3 py-2 rounded">Guardar cambios</button>
        <button @click="editing = null" class="border px-3 py-2 rounded">Cancelar</button>
      </div>
    </section>

    <!-- Lista -->
    <section class="space-y-4">
      <article v-for="p in posts || []" :key="p.id" class="border rounded p-4">
        <header class="flex justify-between items-center">
          <h3 class="font-semibold text-lg">{{ p.title }}</h3>
          <small class="text-gray-500">{{ new Date(p.created_at).toLocaleString() }}</small>
        </header>
        <p class="whitespace-pre-wrap mt-2">{{ p.content }}</p>
        <div class="mt-3 flex gap-2">
          <button @click="startEdit(p)" class="border px-3 py-1 rounded">Editar</button>
          <button @click="del(p.id)" class="border px-3 py-1 rounded">Eliminar</button>
        </div>
      </article>
    </section>
  </div>
</template>