<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const localError = ref('')

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

async function onSubmit() {
  localError.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    const redirect = route.query.redirect || { name: 'home' }
    router.push(redirect)
  } catch {
    localError.value = authStore.errorMsg || 'No se pudo iniciar sesión.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main role="main" aria-label="Iniciar sesión" class="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="card-title text-2xl md:text-3xl mb-4 justify-center">Iniciar Sesión</h1>
        
        <form @submit.prevent="onSubmit" role="form" aria-labelledby="login-title">
          <div class="form-control w-full mb-4">
            <label class="label" for="email-login">
              <span class="label-text">Correo electrónico</span>
            </label>
            <input 
              id="email-login"
              v-model="email" 
              type="email" 
              placeholder="email@ejemplo.com" 
              class="input input-bordered w-full" 
              required 
              aria-required="true"
              aria-describedby="email-hint"
            />
            <span id="email-hint" class="sr-only">Ingresa tu correo electrónico para iniciar sesión</span>
          </div>

          <div class="form-control w-full mb-4">
            <label class="label" for="password-login">
              <span class="label-text">Contraseña</span>
            </label>
            <input 
              id="password-login"
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              class="input input-bordered w-full" 
              required 
              aria-required="true"
              aria-describedby="password-hint"
            />
            <span id="password-hint" class="sr-only">Ingresa tu contraseña</span>
          </div>

          <button 
            :disabled="loading" 
            type="submit" 
            class="btn btn-primary w-full"
            :aria-busy="loading"
            aria-label="Iniciar sesión">
            <span v-if="!loading">Iniciar Sesión</span>
            <span v-else class="loading loading-spinner" aria-hidden="true"></span>
          </button>
        </form>

        <div v-if="localError" 
             role="alert" 
             aria-live="polite" 
             class="alert alert-error mt-4"
             aria-describedby="error-message">
          <span id="error-message">{{ localError }}</span>
        </div>

        <div class="text-center mt-4" role="navigation" aria-label="Navegación de registro">
          <p class="text-sm">
            ¿No tienes cuenta? 
            <router-link :to="{ name:'register' }" class="link link-primary" aria-label="Ir a crear una cuenta">
              Crear cuenta
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>