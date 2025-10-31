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
  <div class="min-h-screen bg-base-300">
    <NavBar />
    <main role="main" aria-label="Editar curso" class="container mx-auto px-2 md:px-4 pt-20 md:pt-24 pb-4">
      <h1 class="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Editar Curso</h1>
      
      <div v-if="course" class="max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-lg shadow-2xl border-2 border-gray-300">
        <form @submit.prevent="showUpdateConfirmModal = true" 
              class="space-y-4" 
              role="form"
              aria-labelledby="edit-course-title">
          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-sm md:text-base">Código</span></label>
            <input v-model="course.codigo" type="text" class="input input-bordered input-enhanced w-full input-sm md:input-md" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-sm md:text-base">Nombre</span></label>
            <input v-model="course.nombre" type="text" class="input input-bordered input-enhanced w-full input-sm md:input-md" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-sm md:text-base">Precio</span></label>
            <input v-model="course.precio" type="number" min="0" step="any" class="input input-bordered input-enhanced w-full input-sm md:input-md" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-sm md:text-base">Duración</span></label>
            <input v-model="course.duracion" type="text" class="input input-bordered input-enhanced w-full input-sm md:input-md" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-sm md:text-base">Descripción</span></label>
            <textarea v-model="course.descripcion" class="textarea textarea-bordered textarea-enhanced w-full textarea-sm md:textarea-md" rows="4"></textarea>
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-sm md:text-base">Cupos</span></label>
            <input v-model="course.cupos" type="number" min="1" step="1" class="input input-bordered input-enhanced w-full input-sm md:input-md" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-sm md:text-base">URL de Imagen</span></label>
            <input v-model="course.img" type="url" class="input input-bordered input-enhanced w-full input-sm md:input-md" placeholder="Ingresa la URL" />
          </div>

          <div class="flex flex-col sm:flex-row justify-center gap-4 mt-6 md:mt-8 pt-6 border-t border-gray-300">
            <button type="button" 
                    @click="router.push('/admin')" 
                    class="btn btn-ghost w-full sm:w-auto flex-1"
                    aria-label="Cancelar edición y volver a administración">
              Cancelar
            </button>
            <button type="submit" 
                    class="btn btn-primary w-full sm:w-auto flex-1"
                    aria-label="Actualizar curso">
              Actualizar Curso
            </button>
          </div>
        </form>
      </div>
      
      <div v-else class="alert alert-warning">
        <span>Cargando información del curso...</span>
      </div>
    </main>

    <div v-if="showUpdateConfirmModal" 
         role="dialog" 
         aria-labelledby="confirm-update-title"
         aria-describedby="confirm-update-description"
         aria-modal="true"
         class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-2xl border-2 md:border-4 border-blue-600 max-w-md w-full p-4 md:p-6">
        <h3 id="confirm-update-title" class="font-bold text-lg md:text-xl mb-3 text-blue-600">✨ Confirmar Actualización</h3>
        <div class="divider my-3"></div>
        <p id="confirm-update-description" class="py-2 text-sm md:text-base">
          ¿Estás seguro de que deseas guardar los cambios en este curso?
        </p>
        <div class="mt-4 pt-4 border-t border-gray-300 flex justify-evenly gap-2">
          <button @click="showUpdateConfirmModal = false" 
                  class="btn btn-ghost btn-sm flex-1"
                  aria-label="Cancelar actualización">
            Cancelar
          </button>
          <button @click="confirmUpdateCourse()" 
                  class="btn btn-primary btn-sm flex-1"
                  aria-label="Confirmar actualización del curso">
            Sí, actualizar
          </button>
        </div>
      </div>
      <div class="absolute inset-0 bg-gray-800/80 -z-10" 
           @click="showUpdateConfirmModal = false"
           aria-label="Cerrar modal"
           role="button"
           tabindex="0"
           @keydown.enter="showUpdateConfirmModal = false"
           @keydown.escape="showUpdateConfirmModal = false"></div>
    </div>

    <!-- Toast de éxito -->
    <div v-if="showSuccessToast" 
         role="alert" 
         aria-live="polite" 
         aria-atomic="true"
         class="toast toast-top toast-end">
      <div class="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>¡Curso actualizado exitosamente!</span>
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
        <span>Error al actualizar el curso</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>