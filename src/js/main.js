// Script global para todas las páginas
console.log("App cargada correctamente.");

// Ejemplo: dark mode toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dark-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
    });
  }
});
