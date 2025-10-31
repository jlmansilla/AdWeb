<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const localError = ref('')

const router = useRouter()
const authStore = useAuthStore()

async function onSubmit() {
  localError.value = ''
  loading.value = true
  try {
    await authStore.register(email.value, password.value)
    router.push({ name: 'home' })
  } catch {
    localError.value = authStore.errorMsg || 'No se pudo registrar.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main role="main" aria-label="Crear cuenta" class="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="card-title text-2xl md:text-3xl mb-4 justify-center">Crear Cuenta</h1>
        
        <form @submit.prevent="onSubmit" role="form" aria-labelledby="register-title">
          <div class="form-control w-full mb-4">
            <label class="label" for="email-register">
              <span class="label-text">Correo electrónico</span>
            </label>
            <input 
              id="email-register"
              v-model="email" 
              type="email" 
              placeholder="email@ejemplo.com" 
              class="input input-bordered w-full" 
              required 
              aria-required="true"
              aria-describedby="email-register-hint"
            />
            <span id="email-register-hint" class="sr-only">Ingresa tu correo electrónico para crear una cuenta</span>
          </div>

          <div class="form-control w-full mb-4">
            <label class="label" for="password-register">
              <span class="label-text">Contraseña</span>
            </label>
            <input 
              id="password-register"
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              class="input input-bordered w-full" 
              required 
              aria-required="true"
              aria-describedby="password-register-hint"
            />
            <span id="password-register-hint" class="sr-only">Crea una contraseña segura</span>
          </div>

          <button 
            :disabled="loading" 
            type="submit" 
            class="btn btn-primary w-full"
            :aria-busy="loading"
            aria-label="Crear cuenta">
            <span v-if="!loading">Crear Cuenta</span>
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

        <div class="text-center mt-4" role="navigation" aria-label="Navegación de inicio de sesión">
          <p class="text-sm">
            ¿Ya tienes cuenta? 
            <router-link :to="{ name:'login' }" class="link link-primary" aria-label="Ir a iniciar sesión">
              Iniciar sesión
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>