<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { agregarCursos } from '@/data/iniciales'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const coursesStore = useCoursesStore()

const showAddModal = ref(false)
const showDeleteModal = ref(false)
const courseToDelete = ref(null)
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const showDeleteSuccessToast = ref(false)
const showInitToast = ref(false)
const isInitializing = ref(false)

const newCourse = ref({
  codigo: '',
  nombre: '',
  estado: true,
  precio: '',
  duracion: '',
  descripcion: '',
  cupos: '',
  inscritos: 0,
  img: ''
})

let unsubscribe = null

function handleImageError(event) {
  // Evitar bucle infinito: solo establecer placeholder si no es ya un placeholder
  if (!event.target.src.includes('via.placeholder.com') && !event.target.src.includes('placeholder')) {
    event.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen'
  } else {
    // Si el placeholder también falla, ocultar la imagen o usar un fallback local
    event.target.style.display = 'none'
  }
}

onMounted(() => {
  unsubscribe = coursesStore.subscribeToCourses()
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

function openAddModal() {
  newCourse.value = {
    codigo: '',
    nombre: '',
    estado: true,
    precio: '',
    duracion: '',
    descripcion: '',
    cupos: '',
    inscritos: 0,
    img: ''
  }
  showAddModal.value = true
  // Scroll automático después de que el modal se abra
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 100)
}

async function confirmAddCourse() {
  try {
    const courseData = {
      ...newCourse.value,
      precio: String(newCourse.value.precio),
      cupos: parseInt(newCourse.value.cupos),
      inscritos: parseInt(newCourse.value.inscritos)
    }
    await coursesStore.addCourse(courseData)
    showAddModal.value = false
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  } catch (error) {
    showErrorToast.value = true
    setTimeout(() => {
      showErrorToast.value = false
    }, 3000)
  }
}

function openDeleteModal(course) {
  courseToDelete.value = course
  showDeleteModal.value = true
  // Scroll automático después de que el modal se abra
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 100)
}

async function confirmDeleteCourse() {
  try {
    await coursesStore.deleteCourse(courseToDelete.value.id)
    showDeleteModal.value = false
    showDeleteSuccessToast.value = true
    setTimeout(() => {
      showDeleteSuccessToast.value = false
    }, 3000)
  } catch (error) {
    showErrorToast.value = true
    setTimeout(() => {
      showErrorToast.value = false
    }, 3000)
  }
}

function editCourse(courseId) {
  router.push({ name: 'edit-course', params: { id: courseId } })
}

async function toggleCourseStatus(course) {
  try {
    await coursesStore.updateCourse(course.id, { estado: !course.estado })
  } catch (error) {
    alert('Error al actualizar el estado: ' + error.message)
  }
}

async function initializeCourses() {
  try {
    isInitializing.value = true
    await agregarCursos()
    showInitToast.value = true
    setTimeout(() => {
      showInitToast.value = false
    }, 3000)
  } catch (error) {
    showErrorToast.value = true
    setTimeout(() => {
      showErrorToast.value = false
    }, 3000)
  } finally {
    isInitializing.value = false
  }
}
</script>

<template>
  <div class="admin-container">
    <!-- Fondo con gradiente sutil -->
    <div class="admin-background"></div>
    
    <NavBar />
    
    <main role="main" aria-label="Administración de cursos" class="admin-content container mx-auto px-2 md:px-4 pt-20 md:pt-24 pb-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4 admin-header">
        <h1 class="text-3xl md:text-4xl font-bold admin-title">Panel de Administración</h1>
        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button @click="initializeCourses" 
                  :disabled="isInitializing"
                  class="action-button secondary-button"
                  :class="{ 'loading': isInitializing }"
                  aria-label="Cargar cursos iniciales">
            <svg v-if="!isInitializing" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span v-if="!isInitializing">Cargar Cursos Iniciales</span>
            <span v-else>Cargando...</span>
          </button>
          <button @click="openAddModal" 
                  class="action-button primary-button"
                  aria-label="Agregar un nuevo curso">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Agregar Curso</span>
          </button>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden lg:block admin-table-container" 
           role="region" 
           aria-label="Tabla de cursos">
        <table class="admin-table" role="table">
          <thead class="table-header">
            <tr role="row">
              <th role="columnheader">Imagen</th>
              <th role="columnheader">Código</th>
              <th role="columnheader">Nombre</th>
              <th role="columnheader">Precio</th>
              <th role="columnheader">Duración</th>
              <th role="columnheader">Cupos</th>
              <th role="columnheader">Estado</th>
              <th role="columnheader">Acciones</th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            <tr v-for="course in coursesStore.courses" :key="course.id" role="row" class="table-row">
              <td class="text-center align-middle">
                <div class="course-image-wrapper mx-auto">
                  <img 
                    :src="course.img" 
                    :alt="`Imagen del curso ${course.nombre}`" 
                    loading="lazy"
                    class="course-thumbnail"
                    @error="handleImageError"
                  />
                </div>
              </td>
              <td class="text-center">{{ course.codigo }}</td>
              <td class="text-center font-semibold">{{ course.nombre }}</td>
              <td class="text-center">${{ parseInt(course.precio).toLocaleString() }}</td>
              <td class="text-center">{{ course.duracion }}</td>
              <td class="text-center">
                <span class="cupos-badge">{{ course.cupos - course.inscritos }} / {{ course.cupos }}</span>
              </td>
              <td class="text-center">
                <input type="checkbox" 
                       :checked="course.estado" 
                       @change="toggleCourseStatus(course)" 
                       class="toggle toggle-success"
                       :aria-label="`${course.estado ? 'Desactivar' : 'Activar'} curso ${course.nombre}`"
                       :aria-checked="course.estado"
                       role="switch" />
              </td>
              <td class="text-center">
                <div class="flex gap-2 justify-center">
                  <button @click="editCourse(course.id)" 
                          class="table-action-btn edit-btn"
                          :aria-label="`Editar curso ${course.nombre}`">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Editar</span>
                  </button>
                  <button @click="openDeleteModal(course)" 
                          class="table-action-btn delete-btn"
                          :aria-label="`Eliminar curso ${course.nombre}`">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Eliminar</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden space-y-4" role="list" aria-label="Lista de cursos para administrar">
        <article v-for="(course, index) in coursesStore.courses" 
                 :key="course.id" 
                 class="mobile-course-card"
                 :style="{ animationDelay: `${index * 0.05}s` }"
                 role="listitem"
                 :aria-labelledby="`mobile-course-${course.id}`">
          <div class="mobile-card-content">
            <div class="flex items-center gap-4 mb-4">
              <div class="mobile-course-image">
                <img 
                  :src="course.img" 
                  :alt="`Imagen de ${course.nombre}`" 
                  loading="lazy"
                  @error="handleImageError"
                />
              </div>
              <div class="flex-1">
                <h2 :id="`mobile-course-${course.id}`" class="mobile-course-title">{{ course.nombre }}</h2>
                <p class="mobile-course-code">Código: {{ course.codigo }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span class="font-semibold text-gray-600">Precio:</span>
                <p class="font-bold">${{ parseInt(course.precio).toLocaleString() }}</p>
              </div>
              <div>
                <span class="font-semibold text-gray-600">Duración:</span>
                <p class="font-bold">{{ course.duracion }}</p>
              </div>
              <div>
                <span class="font-semibold text-gray-600">Cupos:</span>
                <p class="font-bold">{{ course.cupos - course.inscritos }} / {{ course.cupos }}</p>
              </div>
              <div>
                <span class="font-semibold text-gray-600">Estado:</span>
                <input type="checkbox" 
                       :checked="course.estado" 
                       @change="toggleCourseStatus(course)" 
                       class="toggle toggle-success toggle-sm ml-2"
                       :aria-label="`${course.estado ? 'Desactivar' : 'Activar'} curso ${course.nombre}`"
                       :aria-checked="course.estado"
                       role="switch" />
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="editCourse(course.id)" 
                      class="mobile-action-btn edit-btn flex-1"
                      :aria-label="`Editar curso ${course.nombre}`">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Editar</span>
              </button>
              <button @click="openDeleteModal(course)" 
                      class="mobile-action-btn delete-btn flex-1"
                      :aria-label="`Eliminar curso ${course.nombre}`">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </main>

    <div v-if="showAddModal" 
         role="dialog" 
         aria-labelledby="add-modal-title" 
         aria-describedby="add-modal-description"
         aria-modal="true"
         class="modal-overlay">
      <div class="modal-backdrop" 
           @click="showAddModal = false"></div>
      <div class="modal-content add-modal">
        <div class="modal-header">
          <svg xmlns="http://www.w3.org/2000/svg" class="modal-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 id="add-modal-title" class="modal-title">Agregar Nuevo Curso</h3>
        </div>
        <p id="add-modal-description" class="sr-only">Complete el formulario para agregar un nuevo curso</p>
        <form @submit.prevent="confirmAddCourse" role="form" class="modal-form">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-field">
              <label class="field-label">Código</label>
              <input v-model="newCourse.codigo" type="text" class="field-input" required />
            </div>
            <div class="form-field">
              <label class="field-label">Nombre</label>
              <input v-model="newCourse.nombre" type="text" class="field-input" required />
            </div>
            <div class="form-field">
              <label class="field-label">Precio</label>
              <input v-model="newCourse.precio" type="number" min="0" step="any" class="field-input" required />
            </div>
            <div class="form-field">
              <label class="field-label">Duración</label>
              <input v-model="newCourse.duracion" type="text" class="field-input" required />
            </div>
            <div class="form-field md:col-span-2">
              <label class="field-label">Descripción</label>
              <textarea v-model="newCourse.descripcion" class="field-textarea" rows="3" required></textarea>
            </div>
            <div class="form-field">
              <label class="field-label">Cupos</label>
              <input v-model="newCourse.cupos" type="number" min="1" step="1" class="field-input" required />
            </div>
            <div class="form-field md:col-span-2">
              <label class="field-label">URL de Imagen</label>
              <input v-model="newCourse.img" type="url" class="field-input" required />
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" 
                    @click="showAddModal = false" 
                    class="modal-btn cancel-btn"
                    aria-label="Cancelar y cerrar modal">
              Cancelar
            </button>
            <button type="submit" 
                    class="modal-btn submit-btn"
                    aria-label="Agregar curso">
              Agregar Curso
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" 
         role="dialog" 
         aria-labelledby="delete-modal-title" 
         aria-describedby="delete-modal-description"
         aria-modal="true"
         class="modal-overlay">
      <div class="modal-backdrop" 
           @click="showDeleteModal = false"></div>
      <div class="modal-content delete-modal">
        <div class="modal-header delete-header">
          <svg xmlns="http://www.w3.org/2000/svg" class="modal-icon delete-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 id="delete-modal-title" class="modal-title delete-title">Confirmar Eliminación</h3>
        </div>
        <p id="delete-modal-description" class="delete-message">
          ¿Estás seguro de que deseas eliminar el curso <strong>"{{ courseToDelete?.nombre }}"</strong>?
        </p>
        <p class="delete-warning" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Esta acción no se puede deshacer.
        </p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" 
                  class="modal-btn cancel-btn"
                  aria-label="Cancelar eliminación">
            Cancelar
          </button>
          <button @click="confirmDeleteCourse()" 
                  class="modal-btn delete-confirm-btn"
                  aria-label="Confirmar y eliminar curso">
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- Toasts usando Teleport -->
  <Teleport to="body">
    <!-- Toast de éxito - Curso agregado -->
    <Transition name="toast-slide">
      <div v-if="showSuccessToast" 
           class="toast-notification toast-success"
           role="alert" 
           aria-live="polite" 
           aria-atomic="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-semibold">¡Curso agregado exitosamente!</span>
      </div>
    </Transition>

    <!-- Toast de éxito - Curso eliminado -->
    <Transition name="toast-slide">
      <div v-if="showDeleteSuccessToast" 
           class="toast-notification toast-success"
           role="alert" 
           aria-live="polite" 
           aria-atomic="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-semibold">¡Curso eliminado exitosamente!</span>
      </div>
    </Transition>

    <!-- Toast de éxito - Cursos iniciales cargados -->
    <Transition name="toast-slide">
      <div v-if="showInitToast" 
           class="toast-notification toast-success"
           role="alert" 
           aria-live="polite" 
           aria-atomic="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-semibold">¡Cursos iniciales cargados exitosamente!</span>
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
        <span class="font-semibold">Error al procesar la operación</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Contenedor principal */
.admin-container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Fondo con gradiente sutil */
.admin-background {
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

.admin-content {
  position: relative;
  z-index: 1;
}

/* Header */
.admin-header {
  animation: fadeInDown 0.6s ease-out;
}

.admin-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

/* Botones de acción principales */
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

@media (min-width: 640px) {
  .action-button {
    width: auto;
  }
}

.primary-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.secondary-button {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
}

.secondary-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(240, 147, 251, 0.4);
}

.secondary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Tabla de escritorio */
.admin-table-container {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.table-header th {
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.table-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.table-row:hover {
  background: rgba(102, 126, 234, 0.05);
}

.table-row td {
  padding: 1rem;
}

.course-image-wrapper {
  width: 4rem;
  height: 4rem;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.course-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cupos-badge {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
}

/* Botones de acción en tabla */
.table-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* Cards móvil */
.mobile-course-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out backwards;
}

.mobile-course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.2);
}

.mobile-card-content {
  padding: 1.25rem;
}

.mobile-course-image {
  width: 5rem;
  height: 5rem;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.mobile-course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mobile-course-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.mobile-course-code {
  font-size: 0.875rem;
  color: #6b7280;
}

.mobile-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-action-btn.edit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.mobile-action-btn.delete-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

/* Modales */
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
  max-height: 90vh;
  overflow-y: auto;
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

.add-modal {
  width: 100%;
  max-width: 60rem;
  padding: 2rem;
}

.delete-modal {
  width: 100%;
  max-width: 28rem;
  padding: 2rem;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
}

.delete-header {
  border-bottom-color: rgba(239, 68, 68, 0.2);
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

.delete-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.delete-title {
  color: #dc2626;
}

/* Formulario del modal */
.modal-form {
  margin-top: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.field-input,
.field-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
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
  min-height: 80px;
}

/* Mensaje de eliminación */
.delete-message {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.delete-message strong {
  color: #dc2626;
  font-weight: 700;
}

.delete-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(245, 87, 108, 0.1);
  border: 1px solid rgba(245, 87, 108, 0.3);
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

/* Acciones del modal */
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
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

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
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

.delete-confirm-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.delete-confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

/* Responsive */
@media (max-width: 640px) {
  .add-modal {
    padding: 1.5rem;
  }

  .delete-modal {
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>