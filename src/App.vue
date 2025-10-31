<script setup>
import { watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { agregarCursos } from '@/data/iniciales'

const authStore = useAuthStore()
let cursosInicializados = false

// Cargar cursos iniciales cuando el usuario esté autenticado (solo una vez)
// La función agregarCursos() incluye verificación para no duplicar cursos
watch(() => authStore.user, async (user) => {
  if (user && !cursosInicializados) {
    cursosInicializados = true
    await agregarCursos()
  }
}, { immediate: true })
</script>

<template>
  <RouterView />
</template>

<style>
body {
  background-color: #f1f5f9; /* base-200 */
}
</style>
