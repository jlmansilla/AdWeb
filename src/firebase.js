import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Validar que las variables de entorno estén configuradas
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Verificar si faltan variables de entorno
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  const errorMessage = `❌ Error de configuración: Faltan variables de entorno de Firebase:\n${missingVars.map(v => `  - VITE_FIREBASE_${v.toUpperCase()}\n`).join('')}\n\nPor favor, configura estas variables antes de hacer el build.`;
  console.error(errorMessage);
  
  // Mostrar error en la página si estamos en el navegador
  if (typeof document !== 'undefined') {
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f1f5f9; font-family: system-ui, -apple-system, sans-serif;">
        <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px;">
          <h1 style="color: #dc2626; margin-top: 0;">⚠️ Error de Configuración</h1>
          <p style="color: #374151; line-height: 1.6;">
            Faltan variables de entorno de Firebase necesarias para inicializar la aplicación.
          </p>
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 1rem; margin: 1rem 0; border-radius: 4px;">
            <strong style="color: #dc2626;">Variables faltantes:</strong>
            <ul style="margin: 0.5rem 0 0 1.5rem; color: #6b7280;">
              ${missingVars.map(v => `<li>VITE_FIREBASE_${v.toUpperCase()}</li>`).join('')}
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0;">
            Por favor, configura un archivo <code style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px;">.env.local</code> con estas variables antes de hacer el build.
          </p>
        </div>
      </div>
    `;
  }
  
  throw new Error(errorMessage);
}

const firebaseConfig = requiredEnvVars;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);