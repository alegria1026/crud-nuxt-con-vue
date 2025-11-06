<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { login } = useAuth();
const username = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  try {
    await login(username.value, password.value);
    navigateTo('/');
  } catch (err: any) {
    error.value = err?.data?.error || 'Error al iniciar sesión';
  }
};
</script>

<template>
  <div class="login">
    <h1>Iniciar sesión</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="username" type="text" placeholder="Usuario" />
      <input v-model="password" type="password" placeholder="Contraseña" />
      <button type="submit">Entrar</button>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </form>
  </div>
</template>