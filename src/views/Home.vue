<script setup>
import { onMounted, onUnmounted, watch, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCoursesStore } from '@/stores/courses'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const authStore = useAuthStore()
const coursesStore = useCoursesStore()

let unsubscribe = null

// Toasts
const showEnrollSuccessToast = ref(false)
const showEnrollErrorToast = ref(false)
const enrollErrorMessage = ref('')
let welcomeToastTimeout = null

// Auto-cerrar el toast de bienvenida después de 3 segundos
watch(() => authStore.showWelcomeModal, (value) => {
  if (value) {
    // Limpiar timeout previo si existe
    if (welcomeToastTimeout) {
      clearTimeout(welcomeToastTimeout)
    }
    // Establecer nuevo timeout
    welcomeToastTimeout = setTimeout(() => {
      authStore.showWelcomeModal = false
      welcomeToastTimeout = null
    }, 3000)
  }
}, { immediate: true })

function handleImageError(event) {
  // Evitar bucle infinito: solo establecer placeholder si no es ya un placeholder
  if (!event.target.src.includes('via.placeholder.com') && !event.target.src.includes('placeholder')) {
    event.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen'
  } else {
    // Si el placeholder también falla, ocultar la imagen o usar un fallback local
    event.target.style.display = 'none'
  }
}

async function enroll(course) {
  try {
    if (!authStore.user) {
      alert('Debes iniciar sesión para inscribirte.')
      router.push({ name: 'login', query: { redirect: '/home' } })
      return
    }
    await coursesStore.enrollInCourse(course.id, authStore.user.uid)
    showEnrollSuccessToast.value = true
    setTimeout(() => {
      showEnrollSuccessToast.value = false
    }, 3000)
  } catch (err) {
    enrollErrorMessage.value = err.message || 'Ocurrió un error al inscribirte'
    showEnrollErrorToast.value = true
    setTimeout(() => {
      showEnrollErrorToast.value = false
    }, 3000)
  }
}

onMounted(async () => {
  unsubscribe = coursesStore.subscribeToCourses()
  if (authStore.user) {
    coursesStore.subscribeToUserEnrollments(authStore.user.uid)
  }
})

watch(() => authStore.user, (user) => {
  if (user) {
    coursesStore.subscribeToUserEnrollments(user.uid)
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
  // Limpiar timeout si el componente se desmonta
  if (welcomeToastTimeout) {
    clearTimeout(welcomeToastTimeout)
  }
})
</script>

<template>
  <div class="home-container">
    <!-- Fondo con gradiente sutil -->
    <div class="home-background"></div>
    
    <NavBar />
    
    <!-- Contenedor principal con espacio fijo -->
    <main class="main-content" role="main" aria-label="Cursos disponibles">
      <div class="container mx-auto px-4 py-4 md:py-6">
        <div class="mb-6 md:mb-8 page-header">
          <h1 class="text-3xl md:text-4xl font-bold text-center">Cursos Disponibles</h1>
          <p class="text-center text-gray-600 mt-2">Descubre y aprende con nuestros cursos</p>
        </div>

        <div v-if="coursesStore.loading" 
             class="text-center py-8" 
             role="status" 
             aria-live="polite"
             aria-label="Cargando cursos">
          <span class="loading loading-spinner loading-lg" aria-hidden="true"></span>
          <span class="sr-only">Cargando cursos disponibles...</span>
        </div>

        <div v-else-if="coursesStore.activeCourses.length === 0" 
             class="text-center py-8" 
             role="status"
             aria-live="polite">
          <p class="text-lg">No hay cursos disponibles</p>
        </div>

        <div v-else 
             class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" 
             role="region" 
             aria-label="Lista de cursos disponibles">
          <article v-for="(course, index) in coursesStore.activeCourses" 
                   :key="course.id" 
                   class="course-card"
                   :style="{ animationDelay: `${index * 0.1}s` }"
                   role="article"
                   :aria-labelledby="`course-title-${course.id}`">
            <figure class="course-image-container">
              <img 
                :src="course.img" 
                :alt="`Imagen del curso ${course.nombre}`"
                class="course-image"
                loading="lazy"
                @error="handleImageError"
              />
              <div class="course-overlay"></div>
            </figure>
            <div class="course-body">
              <h2 :id="`course-title-${course.id}`" class="course-title">
                {{ course.nombre }}
              </h2>
              <p class="course-description">{{ course.descripcion }}</p>
              <div class="course-badge" 
                   role="status" 
                   :aria-label="`${course.cupos - course.inscritos} cupos disponibles`">
                <svg xmlns="http://www.w3.org/2000/svg" class="badge-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>{{ course.cupos - course.inscritos }} CUPOS</span>
              </div>
              <div class="course-actions">
                <button 
                  :aria-label="`Inscribirse en el curso ${course.nombre}`"
                  class="enroll-button"
                  :class="{ 'disabled': !authStore.user || (course.cupos - course.inscritos <= 0) || coursesStore.isUserEnrolled(course.id) }"
                  :disabled="!authStore.user || (course.cupos - course.inscritos <= 0) || coursesStore.isUserEnrolled(course.id)"
                  @click="enroll(course)">
                  <span v-if="!authStore.user">Inicia sesión</span>
                  <span v-else-if="coursesStore.isUserEnrolled(course.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="inline h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Inscrito
                  </span>
                  <span v-else-if="course.cupos - course.inscritos <= 0">Sin cupos</span>
                  <span v-else>Inscribirse</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  </div>

  <!-- Toasts usando Teleport -->
  <Teleport to="body">
    <!-- Toast de éxito - Inscripción -->
    <Transition name="toast-slide">
      <div v-if="showEnrollSuccessToast" 
           class="toast-notification toast-success"
           role="alert" 
           aria-live="polite" 
           aria-atomic="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-semibold">¡Inscripción exitosa!</span>
      </div>
    </Transition>

    <!-- Toast de error - Inscripción -->
    <Transition name="toast-slide">
      <div v-if="showEnrollErrorToast" 
           class="toast-notification toast-error"
           role="alert" 
           aria-live="assertive" 
           aria-atomic="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-semibold">{{ enrollErrorMessage }}</span>
      </div>
    </Transition>

    <!-- Toast de bienvenida -->
    <Transition name="toast-slide">
      <div v-if="authStore.showWelcomeModal" 
           class="toast-notification toast-info"
           role="alert" 
           aria-live="polite" 
           aria-atomic="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-semibold">¡Bienvenido! Has ingresado correctamente.</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Fondo con gradiente sutil animado */
.home-background {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8edf5 25%, #f0e7ff 50%, #fce7f3 75%, #f5f7fa 100%);
  background-size: 200% 200%;
  animation: gradientFlow 20s ease infinite;
  z-index: 0;
}

@keyframes gradientFlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.main-content {
  position: relative;
  z-index: 1;
  padding-top: 80px;
  padding-bottom: 2rem;
  min-height: calc(100vh - 80px);
}

@media (min-width: 768px) {
  .main-content {
    padding-top: 100px;
    min-height: calc(100vh - 100px);
  }
}

/* Header de página */
.page-header {
  animation: fadeInDown 0.8s ease-out;
}

.page-header h1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Cards de curso con glassmorphism */
.course-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: fadeInUp 0.6s ease-out backwards;
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

.course-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 50px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

/* Imagen del curso */
.course-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.course-card:hover .course-image {
  transform: scale(1.1);
}

.course-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.course-card:hover .course-overlay {
  opacity: 1;
}

/* Cuerpo de la card */
.course-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  color: #1f2937;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-description {
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Badge con gradiente */
.course-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin: 0 auto;
}

.badge-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Botón de inscripción */
.enroll-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.enroll-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.enroll-button:active:not(:disabled) {
  transform: translateY(0);
}

.enroll-button:disabled,
.enroll-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
}

/* Loading state */
.main-content .loading {
  display: inline-block;
  width: 3rem;
  height: 3rem;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 640px) {
  .course-card {
    border-radius: 1rem;
  }

  .course-body {
    padding: 1.25rem;
  }

  .course-title {
    font-size: 1.1rem;
  }

  .course-badge {
    font-size: 0.8rem;
    padding: 0.4rem 0.875rem;
  }
}

/* Asegurar que el navbar tenga altura consistente */
:deep(.fixed) {
  height: 80px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Reset adicional para contenedores */
:deep(.container) {
  margin-top: 0 !important;
}
</style>

<style>
/* Toasts flotantes (global para que funcione con Teleport) */
.toast-notification {
  position: fixed;
  top: 5rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  min-width: 300px;
  max-width: 90vw;
  font-size: 0.95rem;
}

.toast-success {
  background-color: #10b981;
  color: white;
}

.toast-error {
  background-color: #ef4444;
  color: white;
}

.toast-info {
  background-color: #3b82f6;
  color: white;
}

/* Animación slide desde la derecha */
.toast-slide-enter-active {
  animation: slideInRight 0.3s ease-out;
}

.toast-slide-leave-active {
  animation: slideOutRight 0.3s ease-in;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@media (min-width: 768px) {
  .toast-notification {
    min-width: 350px;
    right: 2rem;
  }
}
</style>