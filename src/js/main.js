// Script global para todas las páginas
console.log("App cargada correctamente.");

// Función para navegar al inicio al hacer clic en el logo
function navigateToHome() {
  // Determinar la ruta correcta según la ubicación actual
  const currentPath = window.location.pathname;
  let homePath = '../../index.html';
  
  // Si estamos en una página dentro de src/pages/, necesitamos subir dos niveles
  if (currentPath.includes('/src/pages/')) {
    homePath = '../../index.html';
  }
  // Si estamos en la raíz del proyecto web
  else if (currentPath.endsWith('/') || currentPath.endsWith('/index.html')) {
    homePath = './index.html';
  }
  // Si estamos en src/
  else if (currentPath.includes('/src/')) {
    homePath = '../index.html';
  }
  
  window.location.href = homePath;
}