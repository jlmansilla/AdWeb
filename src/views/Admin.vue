<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const coursesStore = useCoursesStore()

const showAddModal = ref(false)
const showDeleteModal = ref(false)
const courseToDelete = ref(null)
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const showDeleteSuccessToast = ref(false)

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
  event.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen'
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
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <NavBar />
    
    <main role="main" aria-label="Administración de cursos" class="container mx-auto px-2 md:px-4 pt-20 md:pt-24 pb-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
        <h1 class="text-2xl md:text-3xl font-bold">Administración de Cursos</h1>
        <button @click="openAddModal" 
                class="btn btn-primary btn-sm md:btn-md w-full sm:w-auto hover:scale-105 hover:shadow-lg transition-all duration-200 font-semibold"
                aria-label="Agregar un nuevo curso">
          + Agregar Curso
        </button>
      </div>

      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto bg-base-100 rounded-lg shadow" 
           role="region" 
           aria-label="Tabla de cursos">
        <table class="table table-zebra w-full" role="table">
          <thead>
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
            <tr v-for="course in coursesStore.courses" :key="course.id" role="row">
              <td class="text-center align-middle">
                <div class="avatar mx-auto flex items-center justify-center">
                  <div class="w-16 h-16 rounded">
                    <img 
                      :src="course.img" 
                      :alt="`Imagen del curso ${course.nombre}`" 
                      loading="lazy"
                      class="w-full h-full object-cover object-center"
                      @error="handleImageError"
                    />
                  </div>
                </div>
              </td>
              <td class="text-center">{{ course.codigo }}</td>
              <td class="text-center">{{ course.nombre }}</td>
              <td class="text-center">${{ parseInt(course.precio).toLocaleString() }}</td>
              <td class="text-center">{{ course.duracion }}</td>
              <td class="text-center">{{ course.cupos - course.inscritos }} / {{ course.cupos }}</td>
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
                          class="btn btn-xs btn-primary hover:scale-105 hover:shadow-md transition-all duration-200"
                          :aria-label="`Editar curso ${course.nombre}`">
                    Editar
                  </button>
                  <button @click="openDeleteModal(course)" 
                          class="btn btn-xs btn-error hover:scale-105 hover:shadow-md transition-all duration-200"
                          :aria-label="`Eliminar curso ${course.nombre}`">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden space-y-4" role="list" aria-label="Lista de cursos para administrar">
        <article v-for="course in coursesStore.courses" 
                 :key="course.id" 
                 class="card bg-base-100 shadow-xl"
                 role="listitem"
                 :aria-labelledby="`mobile-course-${course.id}`">
          <div class="card-body p-4">
            <div class="flex items-center gap-4 mb-4">
              <div class="avatar">
                <div class="w-20 rounded">
                  <img 
                    :src="course.img" 
                    :alt="`Imagen de ${course.nombre}`" 
                    loading="lazy"
                    class="object-cover object-center"
                    @error="handleImageError"
                  />
                </div>
              </div>
              <div class="flex-1">
                <h2 :id="`mobile-course-${course.id}`" class="card-title text-sm">{{ course.nombre }}</h2>
                <p class="text-xs text-base-content/70">Código: {{ course.codigo }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-semibold">Precio:</span>
                <p>${{ parseInt(course.precio).toLocaleString() }}</p>
              </div>
              <div>
                <span class="font-semibold">Duración:</span>
                <p>{{ course.duracion }}</p>
              </div>
              <div>
                <span class="font-semibold">Cupos:</span>
                <p>{{ course.cupos - course.inscritos }} / {{ course.cupos }}</p>
              </div>
              <div>
                <span class="font-semibold">Estado:</span>
                <input type="checkbox" 
                       :checked="course.estado" 
                       @change="toggleCourseStatus(course)" 
                       class="toggle toggle-success toggle-sm ml-2"
                       :aria-label="`${course.estado ? 'Desactivar' : 'Activar'} curso ${course.nombre}`"
                       :aria-checked="course.estado"
                       role="switch" />
              </div>
            </div>
            <div class="card-actions justify-end gap-2 mt-4">
              <button @click="editCourse(course.id)" 
                      class="btn btn-sm btn-primary flex-1"
                      :aria-label="`Editar curso ${course.nombre}`">
                Editar
              </button>
              <button @click="openDeleteModal(course)" 
                      class="btn btn-sm btn-error flex-1"
                      :aria-label="`Eliminar curso ${course.nombre}`">
                Eliminar
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
         class="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
      <div class="bg-white rounded-lg shadow-2xl border-2 md:border-4 border-blue-600 w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <h3 id="add-modal-title" class="font-bold text-xl md:text-2xl mb-4 text-primary">➕ Agregar Nuevo Curso</h3>
        <p id="add-modal-description" class="sr-only">Complete el formulario para agregar un nuevo curso</p>
        <div class="divider"></div>
        <form @submit.prevent="confirmAddCourse" role="form">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-sm md:text-base">Código</span></label>
              <input v-model="newCourse.codigo" type="text" class="input input-bordered input-enhanced w-full input-sm md:input-md" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-sm md:text-base">Nombre</span></label>
              <input v-model="newCourse.nombre" type="text" class="input input-bordered input-enhanced w-full input-sm md:input-md" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-sm md:text-base">Precio</span></label>
              <input v-model="newCourse.precio" type="number" min="0" step="any" class="input input-bordered input-enhanced w-full input-sm md:input-md" required />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-sm md:text-base">Duración</span></label>
              <input v-model="newCourse.duracion" type="text" class="input input-bordered input-enhanced w-full input-sm md:input-md" required />
            </div>
            <div class="form-control md:col-span-2">
              <label class="label"><span class="label-text font-semibold text-sm md:text-base">Descripción</span></label>
              <textarea v-model="newCourse.descripcion" class="textarea textarea-bordered textarea-enhanced w-full textarea-sm md:textarea-md" rows="3" required></textarea>
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text font-semibold text-sm md:text-base">Cupos</span></label>
              <input v-model="newCourse.cupos" type="number" min="1" step="1" class="input input-bordered input-enhanced w-full input-sm md:input-md" required />
            </div>
            <div class="form-control md:col-span-2">
              <label class="label"><span class="label-text font-semibold text-sm md:text-base">URL de Imagen</span></label>
              <input v-model="newCourse.img" type="url" class="input input-bordered input-enhanced w-full input-sm md:input-md" required />
            </div>
          </div>
          <div class="modal-action mt-4 md:mt-6 pt-4 border-t border-base-300 flex flex-col sm:flex-row gap-4 justify-end">
            <button type="button" 
                    @click="showAddModal = false" 
                    class="btn btn-ghost w-full sm:w-auto order-2 sm:order-1"
                    aria-label="Cancelar y cerrar modal">
              Cancelar
            </button>
            <button type="submit" 
                    class="btn btn-primary w-full sm:w-auto order-1 sm:order-2"
                    aria-label="Agregar curso">
              Agregar
            </button>
          </div>
        </form>
      </div>
      <div class="absolute inset-0 bg-gray-800/80 -z-10" 
           @click="showAddModal = false"
           aria-label="Cerrar modal"
           role="button"
           tabindex="0"
           @keydown.enter="showAddModal = false"
           @keydown.escape="showAddModal = false"></div>
    </div>

    <div v-if="showDeleteModal" 
         role="dialog" 
         aria-labelledby="delete-modal-title" 
         aria-describedby="delete-modal-description"
         aria-modal="true"
         class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-2xl border-2 md:border-4 border-red-600 max-w-sm w-full p-4 md:p-6">
        <h3 id="delete-modal-title" class="font-bold text-lg md:text-xl mb-3 text-error">⚠️ Confirmar Eliminación</h3>
        <div class="divider my-3"></div>
        <p id="delete-modal-description" class="py-2 text-sm md:text-base">
          ¿Estás seguro de que deseas eliminar el curso <strong class="text-error">"{{ courseToDelete?.nombre }}"</strong>?
        </p>
        <p class="text-xs text-base-content/70 mb-4 bg-warning/10 p-2 rounded-lg" role="alert">⚠️ Esta acción no se puede deshacer.</p>
        <div class="mt-3 pt-3 border-t border-base-300 flex justify-evenly gap-2">
          <button @click="showDeleteModal = false" 
                  class="btn btn-ghost btn-sm flex-1"
                  aria-label="Cancelar eliminación">
            Cancelar
          </button>
          <button @click="confirmDeleteCourse()" 
                  class="btn btn-error btn-sm flex-1"
                  aria-label="Confirmar y eliminar curso">
            Sí, borrar
          </button>
        </div>
      </div>
      <div class="absolute inset-0 bg-gray-800/80 -z-10" 
           @click="showDeleteModal = false"
           aria-label="Cerrar modal"
           role="button"
           tabindex="0"
           @keydown.enter="showDeleteModal = false"
           @keydown.escape="showDeleteModal = false"></div>
    </div>

    <!-- Toast de éxito - Curso agregado -->
    <div v-if="showSuccessToast" 
         role="alert" 
         aria-live="polite" 
         aria-atomic="true"
         class="toast toast-top toast-end">
      <div class="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>¡Curso agregado exitosamente!</span>
      </div>
    </div>

    <!-- Toast de éxito - Curso eliminado -->
    <div v-if="showDeleteSuccessToast" 
         role="alert" 
         aria-live="polite" 
         aria-atomic="true"
         class="toast toast-top toast-end">
      <div class="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>¡Curso eliminado exitosamente!</span>
      </div>
    </div>

    <!-- Toast de error -->
    <div v-if="showErrorToast" 
         role="alert" 
         aria-live="assertive" 
         aria-atomic="true"
         class="toast toast-top toast-end">
      <div class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error al procesar la operación</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>