import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'
import { db } from '@/firebase'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)
  let unsubscribeFunction = null
  let isSubscribed = false

  // Computed
  const activeCourses = computed(() => {
    const filtered = courses.value.filter(c => {
      // Aceptar true (boolean) o "true" (string) como estado activo
      return c.estado === true || c.estado === "true" || c.estado === 1 || c.estado === "1"
    })
    console.log(`🔄 activeCourses computed: ${filtered.length} cursos activos de ${courses.value.length} totales`)
    console.log(`📋 Cursos completos:`, courses.value.map(c => ({
      nombre: c.nombre,
      estado: c.estado,
      tipoEstado: typeof c.estado,
      codigo: c.codigo
    })))
    return filtered
  })

  // Suscribirse a cambios en tiempo real con onSnapshot
  function subscribeToCourses() {
    // Si ya hay una suscripción activa, retornar una función vacía
    if (isSubscribed && unsubscribeFunction) {
      return unsubscribeFunction
    }
    
    try {
      loading.value = true
      isSubscribed = true
      const unsubscribe = onSnapshot(
        collection(db, 'cursos'),
        (snapshot) => {
          courses.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          
          // Diagnóstico: contabilizar cursos por estado
          const activos = courses.value.filter(c => c.estado === true).length
          const inactivos = courses.value.filter(c => c.estado === false).length
          const sinEstado = courses.value.filter(c => c.estado === undefined || c.estado === null).length
          
          console.log(`📊 Total cursos cargados: ${courses.value.length}`)
          console.log(`✅ Activos (estado: true): ${activos}`)
          console.log(`❌ Inactivos (estado: false): ${inactivos}`)
          console.log(`⚠️ Sin estado/null: ${sinEstado}`)
          console.log('📋 Detalle de cursos:', courses.value.map(c => ({ 
            nombre: c.nombre, 
            estado: c.estado,
            codigo: c.codigo,
            id: c.id
          })))
          
          loading.value = false
          error.value = null
        },
        (err) => {
          console.error('❌ Error en onSnapshot:', err)
          error.value = err.message
          loading.value = false
          isSubscribed = false
        }
      )
      
      unsubscribeFunction = () => {
        unsubscribe()
        isSubscribed = false
        unsubscribeFunction = null
      }
      
      return unsubscribeFunction
    } catch (err) {
      console.error('❌ Error al suscribirse a cursos:', err)
      error.value = err.message
      loading.value = false
      isSubscribed = false
      return () => {}
    }
  }

  // Agregar curso con método add
  async function addCourse(courseData) {
    try {
      loading.value = true
      const docRef = await addDoc(collection(db, 'cursos'), courseData)
      return docRef.id
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actualizar curso con método update
  async function updateCourse(courseId, courseData) {
    try {
      loading.value = true
      await updateDoc(doc(db, 'cursos', courseId), courseData)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar curso con método delete
  async function deleteCourse(courseId) {
    try {
      loading.value = true
      await deleteDoc(doc(db, 'cursos', courseId))
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    activeCourses,
    loading,
    error,
    subscribeToCourses,
    addCourse,
    updateCourse,
    deleteCourse
  }
})
