# AdWeb Online - Sistema de Gestión de Cursos

Una aplicación web moderna para la gestión y visualización de cursos en línea, desarrollada con Vue.js 3 y Firebase, con un diseño visual atractivo que implementa glassmorphism, gradientes animados y animaciones fluidas.

## 📋 Descripción

AdWeb Online es una plataforma educativa que permite a los usuarios visualizar cursos disponibles, inscribirse en ellos y a los administradores gestionar el catálogo de cursos de manera eficiente. La aplicación cuenta con un sistema robusto de inscripciones con transacciones atómicas, prevención de re-inscripciones, y un diseño moderno con efectos visuales de última generación.

## 🎯 Funcionalidades Principales

### Para Usuarios
- **Visualización de Cursos**: Lista de cursos disponibles con información detallada y diseño moderno
- **Sistema de Autenticación**: Registro e inicio de sesión con Firebase Auth y diseño atractivo
- **Inscripción en Cursos**: Sistema robusto con transacciones atómicas de Firestore
- **Prevención de Re-inscripción**: Control automático para evitar inscripciones duplicadas
- **Notificaciones Toast**: Sistema de notificaciones elegante con animaciones
- **Interfaz Responsive**: Diseño adaptable con efectos visuales en todos los dispositivos
- **Tracking en Tiempo Real**: Actualización instantánea de cupos y estado de inscripciones

### Para Administradores
- **Gestión de Cursos**: Crear, editar y eliminar cursos con interfaz moderna
- **Control de Estado**: Activar/desactivar cursos con toggle visual
- **Vista de Dashboard**: Tabla con glassmorphism y cards móviles animadas
- **Modales Interactivos**: Confirmaciones con diseño moderno y animaciones
- **Carga de Cursos Iniciales**: Botón para cargar datos de prueba automáticamente
- **Vista Desktop y Móvil**: Tabla completa para escritorio, cards elegantes para móvil

### Características de Diseño
- **Glassmorphism**: Efectos de vidrio esmerilado en todas las interfaces
- **Gradientes Animados**: Fondos con gradientes sutiles en movimiento
- **Animaciones Fluidas**: Transiciones suaves y efectos hover elegantes
- **Paleta de Colores Consistente**: Esquema morado/violeta (#667eea, #764ba2)
- **Iconografía SVG**: Iconos vectoriales en toda la aplicación
- **Contraste Optimizado**: Cumple con estándares WCAG 2.1 de accesibilidad

## 🛠️ Tecnologías Utilizadas

- **Frontend**:
  - Vue.js 3 (Composition API con `<script setup>`)
  - Vite (Build tool de última generación)
  - Vue Router (Navegación con lazy loading)
  - Pinia (Gestión de estado moderna)

- **UI/Styling**:
  - CSS3 personalizado con efectos avanzados
  - Glassmorphism y backdrop-filter
  - Gradientes animados con keyframes
  - Animaciones CSS (fadeIn, slideIn, pulse, etc.)
  - SVG inline para iconografía
  - Tailwind CSS (utilidades base)
  - DaisyUI (componentes complementarios)

- **Backend & Database**:
  - Firebase Authentication (Autenticación segura)
  - Firebase Firestore (Base de datos NoSQL)
    - Transacciones atómicas para inscripciones
    - Listeners en tiempo real (onSnapshot)
    - Subcollections para inscripciones de usuarios
  - Firebase Hosting (Despliegue CDN global)

- **DevOps & CI/CD**:
  - GitHub Actions (Despliegue automático)
  - Firebase CLI (Gestión de proyecto)
  - Variables de entorno con Vite

- **Testing**:
  - Vitest (Framework de testing)
  - Pruebas E2E para login y eliminación de cursos

## 📁 Estructura del Proyecto

```
AdWeb/
├── src/
│   ├── components/          # Componentes Vue reutilizables
│   │   └── NavBar.vue      # Barra de navegación con glassmorphism
│   ├── views/              # Vistas/páginas principales
│   │   ├── Home.vue        # Listado de cursos con cards animadas
│   │   ├── Login.vue       # Login con diseño moderno
│   │   ├── Register.vue    # Registro con efectos visuales
│   │   ├── Admin.vue       # Panel de administración responsive
│   │   └── EditCourse.vue  # Formulario de edición elegante
│   ├── stores/             # Stores de Pinia
│   │   ├── auth.js         # Autenticación y gestión de sesión
│   │   └── courses.js      # Gestión de cursos e inscripciones
│   │       ├── subscribeToCourses()          # Listener en tiempo real
│   │       ├── subscribeToUserEnrollments()  # Tracking de inscripciones
│   │       ├── enrollInCourse()              # Inscripción con transacción
│   │       └── isUserEnrolled()              # Verificación de inscripción
│   ├── data/               # Datos iniciales
│   │   └── iniciales.js    # Cursos de ejemplo para carga inicial
│   ├── router/             # Configuración de rutas
│   │   └── index.js        # Vue Router con protección de rutas
│   ├── firebase.js         # Configuración y validación de Firebase
│   ├── main.js             # Punto de entrada con plugins
│   └── App.vue             # Componente raíz con inicialización
├── .github/
│   └── workflows/
│       └── firebase-hosting-merge.yml  # CI/CD automático
├── tests/                  # Pruebas E2E
├── firebase.json           # Configuración de Firebase Hosting
├── firestore.rules         # Reglas de seguridad de Firestore
├── .env.local             # Variables de entorno (no versionado)
└── package.json           # Dependencias del proyecto
```

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js (v20 o superior)
- npm o yarn
- Cuenta de Firebase

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd m7abpro
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```

4. **Construir el proyecto**
   ```bash
   npm run build
   ```

## 🧪 Testing

### Ejecutar todas las pruebas
```bash
npm run test:run
```

### Ejecutar pruebas en modo watch
```bash
npm run test
```

### Ver cobertura de código
```bash
npm run test:coverage
```

### Interfaz de pruebas
```bash
npm run test:ui
```

### Pruebas Incluidas
- **Login E2E**: Verifica el proceso de inicio de sesión
- **Delete Course E2E**: Verifica la funcionalidad de eliminación de cursos

## 🚀 Despliegue

### Deploy Manual

**IMPORTANTE**: El despliegue debe hacerse manualmente con el siguiente comando:

```bash
firebase deploy --only hosting
```

Este comando desplegará:
- La aplicación construida en la carpeta `dist/`
- Configuración de headers para evitar caché del navegador
- Reglas de reescritura para SPA (Single Page Application)

### Configuración de Firebase

El archivo `firebase.json` incluye:
- **Public**: Carpeta de archivos estáticos (`dist`)
- **Rewrites**: Reglas para enrutamiento de SPA
- **Headers**: Control de caché para archivos estáticos

### Reglas de Firestore

Las reglas actuales permiten:
- **Lectura pública** de la colección `cursos`
- **Escritura** solo para usuarios autenticados
- Lectura/escritura de otras colecciones requiere autenticación

Para actualizar las reglas:
```bash
firebase deploy --only firestore:rules
```

## 📱 Uso de la Aplicación

### Como Usuario
1. **Registro/Login**: Accede con credenciales o crea una cuenta nueva
2. **Explorar Cursos**: Visualiza la lista de cursos con animaciones elegantes
3. **Inscripción**: Haz clic en "Inscribirse" en los cursos disponibles
   - El sistema verifica automáticamente si ya estás inscrito
   - Los cupos se actualizan en tiempo real
   - Recibes notificaciones toast de confirmación
4. **Seguimiento**: El botón muestra "Inscrito" en los cursos donde ya estás registrado

### Como Administrador
1. **Acceso**: Inicia sesión y accede al panel `/admin`
2. **Cargar Datos Iniciales**: Usa el botón "Cargar Cursos Iniciales" para poblar la base de datos
3. **Gestión de Cursos**:
   - **Crear**: Haz clic en "Agregar Curso" y completa el formulario elegante
   - **Editar**: Selecciona "Editar" en cualquier curso para modificar su información
   - **Activar/Desactivar**: Usa el toggle para cambiar el estado del curso
   - **Eliminar**: Elimina cursos con confirmación mediante modal moderno
4. **Vista Responsive**:
   - **Desktop**: Tabla completa con todos los detalles
   - **Móvil**: Cards individuales con diseño optimizado

## 🔑 Credenciales de Prueba App

Para facilitar las pruebas de la aplicación, se han creado los siguientes usuarios:

### Usuarios Administradores

Todos los usuarios comparten la misma contraseña: **`123xmi`**

- **contacto@adweb.cl** - Usuario de contacto
- **jlmansilla@adweb.cl** - Juan Luis Mansilla

### Cómo Usar

1. Accede a la página de Login
2. Ingresa cualquiera de los emails listados
3. Ingresa la contraseña: `123xmi`
4. Una vez autenticado, accede al panel de administración en `/admin`

**Nota**: Todos los usuarios tienen privilegios de administrador y pueden gestionar cursos.

## 🔒 Seguridad

### Reglas de Firestore
```javascript
// Lectura pública de cursos
match /cursos/{cursosId} {
  allow read: if true;
  allow write: if request.auth != null;
}

// Inscripciones de usuario (subcollection)
match /usuarios/{userId}/inscripciones/{enrollmentId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Otras colecciones requieren autenticación
match /{document=**} {
  allow read, write: if request.auth != null;
}
```

### Autenticación
- Implementada con Firebase Authentication
- Soporte para registro e inicio de sesión con email/password
- Manejo de errores y validaciones
- Protección de rutas con guards de Vue Router
- Validación de variables de entorno en tiempo de build

### Integridad de Datos
- **Transacciones Atómicas**: Las inscripciones usan `runTransaction()` de Firestore
- **Prevención de Duplicados**: Verificación antes de crear inscripción
- **Control de Cupos**: Validación de disponibilidad antes de inscribir
- **Actualización Consistente**: Cupos e inscritos se actualizan de forma atómica

## 🎨 Diseño Visual

### Características de Diseño
La aplicación implementa un diseño moderno con:

- **Glassmorphism**: Efectos de vidrio esmerilado en navbar, cards y modales
  ```css
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  ```

- **Gradientes Animados**: Fondos dinámicos en todas las vistas
  ```css
  background: linear-gradient(135deg, #f5f7fa 0%, #e8edf5 25%, #f0e7ff 50%, #fce7f3 75%);
  animation: gradientFlow 20s ease infinite;
  ```

- **Paleta de Colores**:
  - Primario: `#667eea` (Azul-violeta)
  - Secundario: `#764ba2` (Púrpura)
  - Acento: `#f093fb` (Rosa)
  - Error: `#ef4444` (Rojo)

- **Animaciones CSS**:
  - fadeInUp, fadeInDown: Entradas suaves
  - slideIn, slideOut: Transiciones laterales
  - pulse: Efecto de latido en iconos
  - hover effects: Elevación y escala

- **Componentes Visuales**:
  - Cards con sombras profundas y bordes redondeados
  - Botones con gradientes y efectos hover
  - Inputs con focus states elegantes
  - Toasts con animaciones de entrada/salida
  - Modales con backdrop blur

### Accesibilidad
- Contraste WCAG 2.1 AA compliant
- Roles ARIA apropiados
- Navegación por teclado
- Labels descriptivos
- Estados visuales claros

## 📄 Licencia

Este proyecto es parte del Bootcamp Desarrollo de Aplicaciones Front-end Trainee.

## 👥 Autor

**Desarrollo**:
- Juan Luis Mansilla - [@jlmansilla](https://github.com/jlmansilla)
  
---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm install              # Instalar dependencias
npm run dev             # Servidor de desarrollo con hot-reload
npm run build           # Construir para producción
npm run preview         # Vista previa de la build

# Testing
npm run test            # Ejecutar tests en modo watch
npm run test:run        # Ejecutar tests una vez
npm run test:coverage   # Ver cobertura de código
npm run test:ui         # Interfaz de pruebas

# Firebase
firebase login          # Autenticarse en Firebase
firebase init           # Inicializar proyecto Firebase
firebase deploy --only hosting           # Deploy de la aplicación
firebase deploy --only firestore:rules   # Deploy de reglas Firestore

# Utilidades
npm run lint            # Verificar código con ESLint
```

## 🚀 Características Técnicas Avanzadas

### Gestión de Estado con Pinia
```javascript
// Store de cursos con funciones reactivas
const coursesStore = useCoursesStore()
coursesStore.subscribeToCourses()           // Listener en tiempo real
coursesStore.subscribeToUserEnrollments()   // Tracking de inscripciones
coursesStore.enrollInCourse(courseId, userId) // Inscripción transaccional
```

### Transacciones Atómicas
```javascript
// Inscripción con integridad de datos garantizada
await runTransaction(db, async (transaction) => {
  // Verificar existencia del curso
  // Verificar inscripción duplicada
  // Validar cupos disponibles
  // Crear inscripción y actualizar cupos atómicamente
})
```

### Sistema de Notificaciones
- Implementado con Vue `<Teleport>` para posicionamiento global
- Animaciones CSS con `<Transition>`
- Auto-cierre con timeouts configurables
- Tipos: success, error, info

### Optimizaciones de Rendimiento
- Lazy loading de rutas con Vue Router
- Computed properties en lugar de funciones
- Reducción de console.log en producción
- Debounce en eventos de scroll
- Optimización de re-renders con watch

---

## 📈 Roadmap Futuro

- [ ] Sistema de roles (Admin, User)
- [ ] Dashboard con estadísticas
- [ ] Filtros y búsqueda de cursos
- [ ] Paginación de cursos
- [ ] Subida de imágenes a Firebase Storage
- [ ] Notificaciones push
- [ ] Modo oscuro/claro
- [ ] Internacionalización (i18n)

---

**Nota**: Este proyecto incluye GitHub Actions configurado para despliegue automático en producción. Las variables de entorno deben configurarse como secretos en GitHub para el CI/CD.
