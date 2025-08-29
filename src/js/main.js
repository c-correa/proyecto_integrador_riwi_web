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

// Ejemplo: dark mode toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dark-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
    });
  }

  // Agregar funcionalidad de clic a todos los logos
  const logoContainers = document.querySelectorAll('.logo-container, .logo');
  logoContainers.forEach(container => {
    container.style.cursor = 'pointer';
    container.addEventListener('click', navigateToHome);
  });

  // También agregar funcionalidad a logos individuales
  const logoImages = document.querySelectorAll('img[alt*="PawCare"], img[alt*="Logo"]');
  logoImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', navigateToHome);
  });

  // Agregar funcionalidad a elementos con clase logo-text
  const logoTexts = document.querySelectorAll('.logo-text');
  logoTexts.forEach(text => {
    text.style.cursor = 'pointer';
    text.addEventListener('click', navigateToHome);
  });
});
