<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const scrolled = ref(false)
const showMobileMenu = ref(false)

async function handleLogout() {
  try {
    console.log('🚪 Intentando cerrar sesión...')
    await authStore.logout()
    console.log('✅ Sesión cerrada exitosamente')
    router.push('/login')
    showMobileMenu.value = false
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error)
  }
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function navigateAndClose(routeName) {
  router.push({ name: routeName })
  showMobileMenu.value = false
}

onMounted(() => {
  console.log('🔍 NavBar montado - Usuario:', authStore.user)
  
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 20
  })
})
</script>

<template>
  <nav role="banner" aria-label="Navegación principal" class="bg-blue-700 text-white shadow-lg fixed top-0 left-0 right-0 z-50 w-full h-16 border-b-2 border-blue-600">
    <div class="flex items-center justify-between w-full h-full px-4 md:px-8">
      <!-- Logo - izquierda -->
      <div class="flex items-center">
        <a @click="router.push('/home')" 
           role="button"
           aria-label="Ir a inicio"
           class="text-xl md:text-2xl font-bold cursor-pointer text-white hover:text-blue-400 transition-colors">
          AdWeb Online
        </a>
      </div>
      
      <!-- Desktop Menu -->
      <div class="hidden lg:flex items-center gap-8" role="menubar">
        <a @click="router.push('/home')" 
           role="menuitem"
           aria-label="Ver cursos disponibles"
           class="text-base md:text-lg font-medium cursor-pointer text-white hover:text-blue-400 hover:underline underline-offset-8 transition-all">
          Cursos
        </a>
        <a @click="router.push('/admin')" 
           role="menuitem"
           aria-label="Ir a administración"
           class="text-base md:text-lg font-medium cursor-pointer text-white hover:text-blue-400 hover:underline underline-offset-8 transition-all">
          Administración
        </a>
      </div>
      
      <!-- Desktop User Info -->
      <div v-if="authStore.user" class="hidden lg:flex items-center gap-4">
        <span class="text-sm font-medium truncate max-w-xs" aria-label="Usuario autenticado">
          {{ authStore.user.email }}
        </span>
        <button @click="handleLogout" 
                aria-label="Cerrar sesión"
                class="btn btn-error btn-sm hover:scale-105 hover:shadow-lg transition-all duration-200">
          Salir
        </button>
      </div>

      <!-- Mobile Menu Button -->
      <div class="lg:hidden">
        <button @click="toggleMobileMenu" 
                aria-label="Abrir menú de navegación"
                :aria-expanded="showMobileMenu ? 'true' : 'false'"
                aria-controls="mobile-menu"
                class="btn btn-ghost btn-sm text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="showMobileMenu" 
         id="mobile-menu"
         role="menu"
         aria-label="Menú de navegación móvil"
         class="lg:hidden bg-blue-700 border-t border-blue-600">
      <div class="flex flex-col p-4 space-y-4">
        <a @click="navigateAndClose('home')" 
           role="menuitem"
           tabindex="0"
           aria-label="Ver cursos disponibles"
           class="text-lg font-medium cursor-pointer text-white hover:text-blue-400 py-2 transition-all">
          📚 Cursos
        </a>
        <a @click="navigateAndClose('admin')" 
           role="menuitem"
           tabindex="0"
           aria-label="Ir a administración"
           class="text-lg font-medium cursor-pointer text-white hover:text-blue-400 py-2 transition-all">
          ⚙️ Administración
        </a>
        <div v-if="authStore.user" class="pt-4 border-t border-blue-600">
          <p class="text-sm text-blue-200 mb-2" aria-label="Usuario autenticado">{{ authStore.user.email }}</p>
          <button @click="handleLogout" 
                  aria-label="Cerrar sesión"
                  role="menuitem"
                  class="btn btn-error btn-sm w-full hover:scale-105 transition-all duration-200">
            Salir
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>