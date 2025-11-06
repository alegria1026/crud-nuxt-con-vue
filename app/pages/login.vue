<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { login } = useAuth();
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  if (!username.value.trim() || !password.value.trim()) return;
  loading.value = true;
  error.value = '';
  try {
    await login(username.value, password.value);
    navigateTo('/');
  } catch (err: any) {
    error.value = err?.data?.error || 'Error al iniciar sesión';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">Iniciar sesión</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">Usuario</label>
          <input
              id="username"
              v-model="username"
              type="text"
              class="form-input"
              placeholder="Ingresa tu usuario"
              required
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="Ingresa tu contraseña"
              required
          />
        </div>

        <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="loading"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <p v-if="error" class="error-text">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f9fafb, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  text-align: center;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  padding: 0.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  text-align: left;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #111827;
  box-sizing: border-box;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn {
  width: 100%;
  padding: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #111827;
  color: white;
}

.btn:hover:not(:disabled) {
  background: #1f2937;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0;
}
</style>