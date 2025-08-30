// Script global para todas las páginas
console.log("App cargada correctamente.");

// Hacer la función accesible desde atributos inline (onclick) en los HTML
window.navigateToHome = function () {
  const currentPath = window.location.pathname;
  let homePath = '../../index.html';

  if (currentPath.includes('/src/pages/')) {
    homePath = '../../index.html';
  } else if (currentPath.endsWith('/') || currentPath.endsWith('/index.html')) {
    homePath = './index.html';
  } else if (currentPath.includes('/src/')) {
    homePath = '../index.html';
  }

  window.location.href = homePath;
};

// Helper seguro para añadir listeners evitando "cannot read properties of null"
export function safeAddListener(selectorOrElement, event, handler) {
    if (!selectorOrElement) return;
    let el = null;
    if (typeof selectorOrElement === "string") el = document.querySelector(selectorOrElement);
    else el = selectorOrElement;
    if (el) el.addEventListener(event, handler);
}

// Asegura que la lógica del main se ejecute cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    // Añadir listener de forma segura al botón "Explora" (si existe en la página actual)
    safeAddListener('#btn-explora', 'click', () => {
        window.location.href = "../src/pages/search.html";
    });

});
