<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import NavBar from '@/components/NavBar.vue'

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()

const courseId = route.params.id
const course = ref(null)
const showUpdateConfirmModal = ref(false)
const showSuccessToast = ref(false)
const showErrorToast = ref(false)

let unsubscribe = null

function loadCourse() {
  try {
    if (!coursesStore || !coursesStore.courses) {
      return
    }
    
    const foundCourse = coursesStore.courses.find(c => c.id === courseId)
    if (foundCourse) {
      course.value = { ...foundCourse }
    } else if (coursesStore.courses.length > 0) {
      // Si hay cursos cargados pero no se encontró el que buscamos, redirigir
      router.push('/admin')
    }
  } catch (err) {
    console.error('Error al cargar curso:', err)
  }
}

onMounted(() => {
  try {
    unsubscribe = coursesStore.subscribeToCourses()
    
    // Intentar cargar el curso inmediatamente
    loadCourse()
    
    // También intentar cargar después de un pequeño delay
    setTimeout(() => {
      if (!course.value && coursesStore.courses.length > 0) {
        loadCourse()
      }
    }, 100)
  } catch (err) {
    console.error('Error en onMounted de EditCourse:', err)
    router.push('/admin')
  }
})

// Observar cambios en los cursos para cargar el curso cuando esté disponible
watch(() => coursesStore.courses, () => {
  if (coursesStore.courses.length > 0 && !course.value) {
    loadCourse()
  }
}, { immediate: true })

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

async function confirmUpdateCourse() {
  if (!course.value) {
    console.error('No hay curso para actualizar')
    return
  }
  
  try {
    const courseData = {
      ...course.value,
      precio: String(course.value.precio),
      cupos: parseInt(course.value.cupos)
    }
    await coursesStore.updateCourse(courseId, courseData)
    showUpdateConfirmModal.value = false
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
      router.push('/admin')
    }, 2000)
  } catch (err) {
    console.error('Error al actualizar curso:', err)
    showUpdateConfirmModal.value = false
    showErrorToast.value = true
    setTimeout(() => {
      showErrorToast.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="edit-container">
    <!-- Fondo con gradiente sutil -->
    <div class="edit-background"></div>
    
    <NavBar />
    
    <main role="main" aria-label="Editar curso" class="edit-content container mx-auto px-2 md:px-4 pt-20 md:pt-24 pb-4">
      <div class="edit-header">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h1 class="edit-title">Editar Curso</h1>
        <p class="edit-subtitle">Modifica la información del curso</p>
      </div>
      
      <div v-if="course" class="edit-form-container">
        <form @submit.prevent="showUpdateConfirmModal = true" 
              class="edit-form" 
              role="form"
              aria-labelledby="edit-course-title">
          
          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">Código</label>
              <input v-model="course.codigo" type="text" class="field-input" />
            </div>

            <div class="form-field">
              <label class="field-label">Nombre</label>
              <input v-model="course.nombre" type="text" class="field-input" />
            </div>

            <div class="form-field">
              <label class="field-label">Precio</label>
              <input v-model="course.precio" type="number" min="0" step="any" class="field-input" />
            </div>

            <div class="form-field">
              <label class="field-label">Duración</label>
              <input v-model="course.duracion" type="text" class="field-input" />
            </div>

            <div class="form-field full-width">
              <label class="field-label">Descripción</label>
              <textarea v-model="course.descripcion" class="field-textarea" rows="4"></textarea>
            </div>

            <div class="form-field">
              <label class="field-label">Cupos</label>
              <input v-model="course.cupos" type="number" min="1" step="1" class="field-input" />
            </div>

            <div class="form-field full-width">
              <label class="field-label">URL de Imagen</label>
              <input v-model="course.img" type="url" class="field-input" placeholder="https://ejemplo.com/imagen.jpg" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" 
                    @click="router.push('/admin')" 
                    class="action-btn cancel-btn"
                    aria-label="Cancelar edición y volver a administración">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancelar</span>
            </button>
            <button type="submit" 
                    class="action-btn submit-btn"
                    aria-label="Actualizar curso">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Actualizar Curso</span>
            </button>
          </div>
        </form>
      </div>
      
      <div v-else class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando información del curso...</p>
      </div>
    </main>

    <!-- Modal de confirmación -->
    <div v-if="showUpdateConfirmModal" 
         role="dialog" 
         aria-labelledby="confirm-update-title"
         aria-describedby="confirm-update-description"
         aria-modal="true"
         class="modal-overlay">
      <div class="modal-backdrop" 
           @click="showUpdateConfirmModal = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <svg xmlns="http://www.w3.org/2000/svg" class="modal-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 id="confirm-update-title" class="modal-title">Confirmar Actualización</h3>
        </div>
        <p id="confirm-update-description" class="modal-message">
          ¿Estás seguro de que deseas guardar los cambios en este curso?
        </p>
        <div class="modal-actions">
          <button @click="showUpdateConfirmModal = false" 
                  class="modal-btn cancel-modal-btn"
                  aria-label="Cancelar actualización">
            Cancelar
          </button>
          <button @click="confirmUpdateCourse()" 
                  class="modal-btn confirm-modal-btn"
                  aria-label="Confirmar actualización del curso">
            Sí, actualizar
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- Toasts usando Teleport -->
  <Teleport to="body">
    <!-- Toast de éxito -->
    <Transition name="toast-slide">
      <div v-if="showSuccessToast" 
           class="toast-notification toast-success"
           role="alert" 
           aria-live="polite" 
           aria-atomic="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-semibold">¡Curso actualizado exitosamente!</span>
      </div>
    </Transition>

    <!-- Toast de error -->
    <Transition name="toast-slide">
      <div v-if="showErrorToast" 
           class="toast-notification toast-error"
           role="alert" 
           aria-live="assertive" 
           aria-atomic="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-semibold">Error al actualizar el curso</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Contenedor principal */
.edit-container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Fondo con gradiente sutil */
.edit-background {
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

.edit-content {
  position: relative;
  z-index: 1;
}

/* Header */
.edit-header {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeInDown 0.6s ease-out;
}

.header-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.edit-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.edit-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

/* Contenedor del formulario */
.edit-form-container {
  max-width: 56rem;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
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

/* Formulario */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

.field-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.field-input,
.field-textarea {
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.field-input:focus,
.field-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.field-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

/* Acciones del formulario */
.form-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(102, 126, 234, 0.1);
  margin-top: 1rem;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* Estado de carga */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1.5rem;
}

.loading-spinner {
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

.loading-state p {
  font-size: 1.125rem;
  color: #6b7280;
  font-weight: 500;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: -1;
}

.modal-content {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 28rem;
  width: 100%;
  padding: 2rem;
  animation: slideInUp 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
}

.modal-icon {
  width: 3rem;
  height: 3rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.75rem;
  animation: pulse 2s ease-in-out infinite;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.modal-message {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
}

@media (max-width: 640px) {
  .modal-actions {
    flex-direction: column;
  }
}

.modal-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-modal-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-modal-btn:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.confirm-modal-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.confirm-modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .edit-form-container {
    padding: 1.5rem;
  }

  .edit-title {
    font-size: 2rem;
  }

  .edit-subtitle {
    font-size: 1rem;
  }

  .header-icon {
    width: 3.5rem;
    height: 3.5rem;
  }
}

@media (max-width: 640px) {
  .edit-form-container {
    padding: 1.25rem;
    border-radius: 1rem;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }
}
</style>