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
  <nav role="banner" aria-label="Navegación principal" class="navbar-container">
    <div class="navbar-content">
      <!-- Logo - izquierda -->
      <div class="navbar-logo">
        <a @click="router.push('/home')" 
           role="button"
           aria-label="Ir a inicio"
           class="logo-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>AdWeb Online</span>
        </a>
      </div>
      
      <!-- Desktop Menu -->
      <div class="navbar-menu" role="menubar">
        <a @click="router.push('/home')" 
           role="menuitem"
           aria-label="Ver cursos disponibles"
           class="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Cursos</span>
        </a>
        <a @click="router.push('/admin')" 
           role="menuitem"
           aria-label="Ir a administración"
           class="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Administración</span>
        </a>
      </div>
      
      <!-- Desktop User Info -->
      <div v-if="authStore.user" class="navbar-user">
        <div class="user-info">
          <svg xmlns="http://www.w3.org/2000/svg" class="user-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="user-email" aria-label="Usuario autenticado">
            {{ authStore.user.email }}
          </span>
        </div>
        <button @click="handleLogout" 
                aria-label="Cerrar sesión"
                class="logout-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Salir</span>
        </button>
      </div>

      <!-- Mobile Menu Button -->
      <div class="mobile-menu-button">
        <button @click="toggleMobileMenu" 
                aria-label="Abrir menú de navegación"
                :aria-expanded="showMobileMenu ? 'true' : 'false'"
                aria-controls="mobile-menu"
                class="hamburger-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="mobile-menu-slide">
      <div v-if="showMobileMenu" 
           id="mobile-menu"
           role="menu"
           aria-label="Menú de navegación móvil"
           class="mobile-menu">
        <div class="mobile-menu-content">
          <a @click="navigateAndClose('home')" 
             role="menuitem"
             tabindex="0"
             aria-label="Ver cursos disponibles"
             class="mobile-nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" class="mobile-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Cursos</span>
          </a>
          <a @click="navigateAndClose('admin')" 
             role="menuitem"
             tabindex="0"
             aria-label="Ir a administración"
             class="mobile-nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" class="mobile-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Administración</span>
          </a>
          <div v-if="authStore.user" class="mobile-user-section">
            <div class="mobile-user-info">
              <svg xmlns="http://www.w3.org/2000/svg" class="mobile-user-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span aria-label="Usuario autenticado">{{ authStore.user.email }}</span>
            </div>
            <button @click="handleLogout" 
                    aria-label="Cerrar sesión"
                    role="menuitem"
                    class="mobile-logout-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* Contenedor principal del navbar */
.navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9998;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Contenido principal */
.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 0 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .navbar-content {
    padding: 0 2rem;
  }
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  color: #667eea;
}

/* Menú desktop */
.navbar-menu {
  display: none;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .navbar-menu {
    display: flex;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
  transform: translateY(-2px);
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Usuario desktop */
.navbar-user {
  display: none;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .navbar-user {
    display: flex;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 0.75rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
}

.user-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #667eea;
}

.user-email {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

.logout-button:active {
  transform: translateY(0);
}

/* Botón menú móvil */
.mobile-menu-button {
  display: flex;
  align-items: center;
}

@media (min-width: 1024px) {
  .mobile-menu-button {
    display: none;
  }
}

.hamburger-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: #374151;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hamburger-button:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

/* Menú móvil */
.mobile-menu {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

@media (min-width: 1024px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-menu-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.mobile-nav-link:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  transform: translateX(4px);
}

.mobile-nav-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.mobile-user-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 0.75rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
}

.mobile-user-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #667eea;
  flex-shrink: 0;
}

.mobile-user-info span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  width: 100%;
}

.mobile-logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

.mobile-logout-button:active {
  transform: translateY(0);
}

/* Animación del menú móvil */
.mobile-menu-slide-enter-active,
.mobile-menu-slide-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 640px) {
  .navbar-content {
    height: 70px;
  }

  .logo-link {
    font-size: 1.25rem;
  }

  .logo-icon {
    width: 1.75rem;
    height: 1.75rem;
  }
}
</style>