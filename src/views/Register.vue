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
  <main role="main" aria-label="Crear cuenta" class="register-container">
    <div class="register-background"></div>
    
    <div class="register-content">
      <div class="register-card">
        <!-- Logo/Icono -->
        <div class="register-header">
          <div class="register-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 class="register-title">Únete</h1>
          <p class="register-subtitle">Crea tu cuenta para comenzar</p>
        </div>
        
        <form @submit.prevent="onSubmit" role="form" aria-labelledby="register-title" class="register-form">
          <!-- Email Field -->
          <div class="form-group">
            <label class="form-label" for="email-register">
              <span>Correo electrónico</span>
            </label>
            <div class="input-wrapper">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input 
                id="email-register"
                v-model="email" 
                type="email" 
                placeholder="tu@email.com" 
                class="form-input"
                required 
                aria-required="true"
                aria-describedby="email-register-hint"
              />
            </div>
            <span id="email-register-hint" class="sr-only">Ingresa tu correo electrónico para crear una cuenta</span>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label class="form-label" for="password-register">
              <span>Contraseña</span>
            </label>
            <div class="input-wrapper">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input 
                id="password-register"
                v-model="password" 
                type="password" 
                placeholder="••••••••" 
                class="form-input"
                required 
                aria-required="true"
                aria-describedby="password-register-hint"
              />
            </div>
            <span id="password-register-hint" class="sr-only">Crea una contraseña segura</span>
          </div>

          <!-- Submit Button -->
          <button 
            :disabled="loading" 
            type="submit" 
            class="submit-button"
            :class="{ 'loading-btn': loading }"
            :aria-busy="loading"
            aria-label="Crear cuenta">
            <span v-if="!loading">Crear Cuenta</span>
            <span v-else class="loading-spinner">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          </button>
        </form>

        <!-- Error Alert -->
        <div v-if="localError" 
             role="alert" 
             aria-live="polite" 
             class="error-alert"
             aria-describedby="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span id="error-message">{{ localError }}</span>
        </div>

        <!-- Login Link -->
        <div class="login-link" role="navigation" aria-label="Navegación de inicio de sesión">
          <p>
            ¿Ya tienes cuenta? 
            <router-link :to="{ name:'login' }" class="link-primary" aria-label="Ir a iniciar sesión">
              Iniciar sesión
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

/* Fondo animado con gradiente */
.register-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 200%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Contenido con z-index elevado */
.register-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 450px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Card con glassmorphism */
.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Header */
.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.register-icon svg {
  width: 2rem;
  height: 2rem;
}

.register-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.register-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

/* Form */
.register-form {
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
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Submit Button */
.submit-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Error Alert */
.error-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: 1rem;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

/* Login Link */
.login-link {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.login-link p {
  color: #6b7280;
  font-size: 0.9rem;
}

.link-primary {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.link-primary:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 640px) {
  .register-card {
    padding: 1.75rem;
  }

  .register-title {
    font-size: 1.75rem;
  }

  .register-subtitle {
    font-size: 0.875rem;
  }
}

/* Animación de spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>