<script setup>
import { useAuthStore } from '@/stores/auth'
import { watchEffect } from 'vue'
import { agregarCursos } from '@/data/iniciales'

const authStore = useAuthStore()

// Cargar cursos iniciales cuando el usuario esté autenticado
// La función agregarCursos() incluye verificación para no duplicar cursos
watchEffect(async () => {
  if (authStore.user) {
    await agregarCursos()
  }
})
</script>

<template>
  <RouterView />
</template>

<style>
body {
  background-color: #f1f5f9; /* base-200 */
}
</style>
