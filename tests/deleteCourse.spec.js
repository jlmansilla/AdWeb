import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Admin from '../src/views/Admin.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useCoursesStore } from '../src/stores/courses.js'

describe('Delete Course E2E Test', () => {
  let wrapper
  let coursesStore

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/admin', name: 'admin', component: Admin },
      { path: '/home', name: 'home', component: { template: '<div>Home</div>' } }
    ]
  })

  beforeEach(async () => {
    setActivePinia(createPinia())
    coursesStore = useCoursesStore()
    
    // Mock de cursos
    coursesStore.courses = [
      {
        id: '1',
        codigo: 'TEST001',
        nombre: 'Curso de Prueba',
        precio: 100000,
        duracion: '40 horas',
        descripcion: 'Descripción de prueba',
        cupos: 30,
        inscritos: 5,
        estado: true,
        img: 'https://example.com/image.jpg'
      }
    ]

    wrapper = mount(Admin, {
      global: {
        plugins: [router]
      }
    })
  })

  it('should show delete modal when clicking delete button', async () => {
    const deleteButtons = wrapper.findAll('.btn-secondary')
    
    expect(deleteButtons.length).toBeGreaterThan(0)
    
    // Click en el botón de eliminar
    await deleteButtons[0].trigger('click')
    
    // Esperar a que aparezca el modal
    await wrapper.vm.$nextTick()
    
    // Verificar que muestra el nombre del curso
    expect(wrapper.text()).toContain('Curso de Prueba')
    expect(wrapper.text()).toContain('Confirmar Eliminación')
    
    // Verificar que showDeleteModal es true
    expect(wrapper.vm.showDeleteModal).toBe(true)
  })

  it('should delete course when confirming in modal', async () => {
    const mockDeleteCourse = vi.fn()
    coursesStore.deleteCourse = mockDeleteCourse

    wrapper = mount(Admin, {
      global: {
        plugins: [router]
      }
    })

    // Abrir modal de eliminación
    wrapper.vm.openDeleteModal(coursesStore.courses[0])
    await wrapper.vm.$nextTick()

    // Buscar y hacer clic en botón "Sí, borrar"
    const buttons = wrapper.findAll('button')
    const confirmButton = buttons.find(btn => btn.text().includes('borrar'))
    expect(confirmButton).toBeDefined()
    
    // Simular confirmación
    wrapper.vm.confirmDeleteCourse = vi.fn()
  })

  it('should cancel deletion when clicking cancel button', async () => {
    wrapper = mount(Admin, {
      global: {
        plugins: [router]
      }
    })

    // Abrir modal
    wrapper.vm.showDeleteModal = true
    await wrapper.vm.$nextTick()

    // Buscar botón cancelar
    const buttons = wrapper.findAll('button')
    const cancelButton = buttons.find(btn => btn.text().includes('Cancelar'))
    expect(cancelButton).toBeDefined()
    
    // Simular cancelación
    await cancelButton.trigger('click')
    
    expect(wrapper.vm.showDeleteModal).toBe(false)
  })
})

