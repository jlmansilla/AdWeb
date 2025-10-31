# AdWeb Online - Sistema de Gestión de Cursos

Una aplicación web moderna para la gestión y visualización de cursos en línea, desarrollada con Vue.js 3 y Firebase.

## 📋 Descripción

AdWeb Online es una plataforma educativa que permite a los usuarios visualizar cursos disponibles, inscribirse en ellos y a los administradores gestionar el catálogo de cursos de manera eficiente.

## 🎯 Funcionalidades Principales

### Para Usuarios
- **Visualización de Cursos**: Lista de cursos disponibles con información detallada
- **Sistema de Autenticación**: Registro e inicio de sesión con Firebase Auth
- **Inscripción en Cursos**: Posibilidad de inscribirse en cursos disponibles
- **Interfaz Responsive**: Diseño adaptable para diferentes dispositivos

### Para Administradores
- **Gestión de Cursos**: Crear, editar y eliminar cursos
- **Control de Estado**: Activar/desactivar cursos
- **Vista de Dashboard**: Tabla completa con todos los cursos y su información
- **Modales Interactivos**: Confirmaciones de acciones críticas

## 🛠️ Tecnologías Utilizadas

- **Frontend**:
  - Vue.js 3 (Composition API)
  - Vite (Build tool)
  - Vue Router (Navegación)
  - Pinia (Gestión de estado)

- **UI/Styling**:
  - Tailwind CSS (Framework de utilidades CSS)
  - DaisyUI (Componentes de Tailwind CSS)
  - PostCSS (Procesamiento de CSS)

- **Backend**:
  - Firebase Authentication (Autenticación)
  - Firebase Firestore (Base de datos)
  - Firebase Hosting (Despliegue)

- **Testing**:
  - Vitest
  - Pruebas E2E para login y eliminación de cursos

## 📁 Estructura del Proyecto

```
m7abpro/
├── src/
│   ├── components/       # Componentes Vue reutilizables
│   │   └── NavBar.vue   # Barra de navegación
│   ├── views/           # Vistas/páginas principales
│   │   ├── Home.vue     # Página de inicio (listado de cursos)
│   │   ├── Login.vue    # Página de inicio de sesión
│   │   ├── Register.vue # Página de registro
│   │   ├── Admin.vue    # Panel de administración
│   │   └── EditCourse.vue # Edición de cursos
│   ├── stores/          # Stores de Pinia
│   │   ├── auth.js      # Manejo de autenticación
│   │   └── courses.js   # Gestión de cursos
│   ├── router/          # Configuración de rutas
│   ├── firebase.js      # Configuración de Firebase
│   └── main.js          # Punto de entrada de la aplicación
├── tests/               # Pruebas E2E
├── firebase.json        # Configuración de Firebase
├── firestore.rules      # Reglas de seguridad de Firestore
└── package.json         # Dependencias del proyecto
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
1. Ve a la página de inicio `/home`
2. Visualiza los cursos disponibles
3. Inscríbete en los cursos que te interesen

### Como Administrador
1. Inicia sesión en la aplicación
2. Accede al panel de administración `/admin`
3. Gestiona los cursos:
   - Agregar nuevos cursos
   - Editar cursos existentes
   - Activar/desactivar cursos
   - Eliminar cursos (con confirmación)

## 🔑 Credenciales de Prueba App

Para facilitar las pruebas de la aplicación, se han creado los siguientes usuarios:

### Usuarios Administradores

Todos los usuarios comparten la misma contraseña: **`123xmi`**

- **contacto@adweb.cl** - Usuario de contacto
- **gurrutia@adweb.cl** - Gonzalo Urrutia
- **lcarrillo@adweb.cl** - Luis Carrillo
- **chernandez@adweb.cl** - Carolina Hernández
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

// Otras colecciones requieren autenticación
match /{document=**} {
  allow read, write: if request.auth != null;
}
```

### Autenticación
- Implementada con Firebase Authentication
- Soporte para registro e inicio de sesión con email/password
- Manejo de errores y validaciones

## 🎨 Personalización

### Temas DaisyUI
La aplicación incluye múltiples temas configurables:
- Light, Dark
- Cupcake, Bumblebee, Emerald
- Corporate, Synthwave, Retro
- Cyberpunk, Valentine, Halloween
- Y muchos más...

Configuración en `tailwind.config.cjs`

## 📄 Licencia

Este proyecto es parte del Bootcamp Desarrollo de Aplicaciones Front-end Trainee.

## 👥 Autores

**Desarrollo**:
- Juan Luis Mansilla - [@jlmansilla](https://github.com/jlmansilla)
- Gonzalo Urrutia - [@gurrutia15](https://github.com/gurrutia15)
- Luis Carrillo - [@lcarrilloq](https://github.com/lcarrilloq)
- Carolina Hernández - [@CaroHernz](https://github.com/CaroHernz)

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm install         # Instalar dependencias
npm run build      # Construir para producción
npm run preview    # Vista previa de la build

# Testing
npm run test       # Ejecutar tests en modo watch
npm run test:run   # Ejecutar tests una vez
npm run test:coverage  # Ver cobertura

# Deploy
firebase deploy --only hosting  # Deploy manual
firebase deploy --only firestore:rules  # Deploy reglas de Firestore
```

---

**Nota**: Este proyecto incluye GitHub Actions configurado para despliegue automático en producción, pero el despliegue principal se debe realizar manualmente con `firebase deploy --only hosting`.
