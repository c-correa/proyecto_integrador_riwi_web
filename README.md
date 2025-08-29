# PawCare - Pet Care Services Platform

Una plataforma web para servicios de cuidado de mascotas, incluyendo búsqueda de guarderías y registro de proveedores de servicios.

## Cómo ejecutar el proyecto

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación y ejecución

1. **Navega al directorio del proyecto:**
   ```bash
   cd proyecto_integrador_riwi_web
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador:**
   El proyecto se abrirá automáticamente en `http://localhost:5173`

## Estructura del proyecto

```
proyecto_integrador_riwi_web/
├── index.html                 # Página principal
├── src/
│   ├── pages/                # Páginas HTML
│   │   ├── search.html       # Búsqueda de servicios
│   │   ├── login.html        # Inicio de sesión
│   │   ├── register.html     # Registro de usuarios
│   │   ├── register-kennel.html # Registro de guarderías
│   │   └── users.html        # Lista de usuarios
│   ├── styles/               # Archivos CSS
│   │   ├── globals.css       # Estilos globales
│   │   ├── search.css        # Estilos de búsqueda
│   │   ├── auth.css          # Estilos de autenticación
│   │   └── kennel-registration.css # Estilos de registro de guarderías
│   ├── js/                   # Archivos JavaScript
│   │   ├── main.js           # Script principal
│   │   ├── page-search.js    # Lógica de búsqueda
│   │   ├── page-login.js     # Lógica de login
│   │   ├── page-register.js  # Lógica de registro
│   │   ├── page-register-kennel.js # Lógica de registro de guarderías
│   │   └── page-users.js     # Lógica de usuarios
│   └── utils/
│       └── api.js            # Utilidades de API
└── package.json
```

## 🎨 Características

- **Búsqueda de servicios**: Filtros avanzados para encontrar guarderías y servicios
- **Autenticación**: Sistema de login y registro de usuarios
- **Registro de guarderías**: Formulario completo para proveedores de servicios
- **Diseño responsivo**: Adaptable a dispositivos móviles
- **Integración con API**: Conectado al backend para funcionalidad completa

## 🔧 Tecnologías utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos y responsivos
- **JavaScript ES6+**: Funcionalidad interactiva
- **Vite**: Herramienta de desarrollo y build
- **Tailwind CSS**: Framework de utilidades CSS

## 📱 Páginas disponibles

1. **Página principal** (`/`) - Dashboard con enlaces a todas las funcionalidades
2. **Búsqueda** (`/src/pages/search.html`) - Buscar servicios de cuidado de mascotas
3. **Login** (`/src/pages/login.html`) - Iniciar sesión
4. **Registro** (`/src/pages/register.html`) - Crear cuenta de usuario
5. **Registro de guardería** (`/src/pages/register-kennel.html`) - Registro para proveedores
6. **Usuarios** (`/src/pages/users.html`) - Lista de usuarios registrados

## 🌐 API Backend

El frontend está configurado para conectarse con el backend en `http://localhost:3000`. Asegúrate de que tu API esté ejecutándose en ese puerto.

**Nota:** El frontend se ejecuta en el puerto 5173 y el backend en el puerto 3000.

## Solución de problemas

Si el proyecto no se ve correctamente:

1. Verifica que todas las dependencias estén instaladas: `npm install`
2. Asegúrate de que el servidor de desarrollo esté ejecutándose: `npm run dev`
3. Verifica que no haya errores en la consola del navegador
4. Asegúrate de que el backend esté ejecutándose en el puerto 3000
5. Si hay conflictos de puerto, verifica que no haya otros servicios usando el puerto 5173

## 📝 Notas de desarrollo

- Las rutas están configuradas para funcionar con Vite
- Los estilos están organizados por página para mejor mantenimiento
- El código JavaScript está modularizado para facilitar el desarrollo
- Se incluyen fallbacks para cuando la API no esté disponible
