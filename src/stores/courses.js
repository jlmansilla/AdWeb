import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  runTransaction,
  getDoc,
  setDoc,
  query,
  where
} from 'firebase/firestore'
import { db } from '@/firebase'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)
  let unsubscribeFunction = null
  let isSubscribed = false

  // Inscripciones del usuario actual (courseId => true)
  const enrolledCourseIds = ref(new Set())
  let unsubscribeEnrollments = null

  // Computed
  const activeCourses = computed(() => {
    return courses.value.filter(c => {
      // Aceptar true (boolean) o "true" (string) como estado activo
      return c.estado === true || c.estado === "true" || c.estado === 1 || c.estado === "1"
    })
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

  // Suscribirse a inscripciones del usuario
  function subscribeToUserEnrollments(userId) {
    if (!userId) return () => {}
    // Cancelar suscripción previa si existía
    if (unsubscribeEnrollments) {
      unsubscribeEnrollments()
      unsubscribeEnrollments = null
    }
    const q = query(collection(db, 'inscripciones'), where('userId', '==', userId))
    unsubscribeEnrollments = onSnapshot(q, (snapshot) => {
      const set = new Set()
      snapshot.forEach(d => {
        const data = d.data()
        if (data?.courseId) set.add(data.courseId)
      })
      enrolledCourseIds.value = set
    })
    return () => {
      if (unsubscribeEnrollments) {
        unsubscribeEnrollments()
        unsubscribeEnrollments = null
      }
    }
  }

  function isUserEnrolled(courseId) {
    return enrolledCourseIds.value.has(courseId)
  }

  // Inscribir en curso con control de cupos y sin duplicados
  async function enrollInCourse(courseId, userId) {
    if (!userId) throw new Error('Debes iniciar sesión para inscribirte')
    loading.value = true
    try {
      const inscriptionId = `${userId}_${courseId}`
      const courseRef = doc(db, 'cursos', courseId)
      const inscriptionRef = doc(db, 'inscripciones', inscriptionId)

      await runTransaction(db, async (tx) => {
        const [courseSnap, inscriptionSnap] = await Promise.all([
          tx.get(courseRef),
          tx.get(inscriptionRef)
        ])

        if (!courseSnap.exists()) {
          throw new Error('El curso no existe')
        }
        if (inscriptionSnap.exists()) {
          throw new Error('Ya estás inscrito en este curso')
        }

        const course = courseSnap.data()
        const cupos = Number(course.cupos) || 0
        const inscritos = Number(course.inscritos) || 0
        const restantes = cupos - inscritos
        if (restantes <= 0) {
          throw new Error('No hay cupos disponibles')
        }

        // Crear inscripción y aumentar inscritos
        tx.set(inscriptionRef, {
          userId,
          courseId,
          createdAt: new Date().toISOString()
        })
        tx.update(courseRef, { inscritos: inscritos + 1 })
      })

      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
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
    enrolledCourseIds,
    loading,
    error,
    subscribeToCourses,
    subscribeToUserEnrollments,
    isUserEnrolled,
    enrollInCourse,
    addCourse,
    updateCourse,
    deleteCourse
  }
})
