import { defineStore } from 'pinia'
import { ref } from 'vue'
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '@/firebase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const errorMsg = ref(null)
  const showWelcomeModal = ref(false)
  let authInitialized = false
  let resolveAuthInit

  const authInitPromise = new Promise(resolve => {
    resolveAuthInit = resolve
  })

  onAuthStateChanged(auth, (userData) => {
    user.value = userData
    if (!authInitialized) {
      authInitialized = true
      resolveAuthInit()
    }
  })

  async function register(email, password) {
    errorMsg.value = null
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      user.value = newUser
      showWelcomeModal.value = true
    } catch (error) {
      errorMsg.value = 'Error al registrar: ' + error.message
      throw error
    }
  }

  async function login(email, password) {
    errorMsg.value = null
    try {
      const { user: loggedUser } = await signInWithEmailAndPassword(auth, email, password)
      user.value = loggedUser
      showWelcomeModal.value = true
    } catch (error) {
      errorMsg.value = 'Error al iniciar sesión: ' + error.message
      throw error
    }
  }

  async function logout() {
    errorMsg.value = null
    try {
      await signOut(auth)
      user.value = null
    } catch (error) {
      errorMsg.value = 'Error al cerrar sesión: ' + error.message
      throw error
    }
  }

  return {
    user,
    errorMsg,
    showWelcomeModal,
    register,
    login,
    logout,
    waitForAuthInit: () => authInitPromise
  }
})
