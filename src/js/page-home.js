import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("stores-list");

  try {
    // 🚨 Evitar loop en form-info.html
    const currentPage = window.location.pathname;
    if (currentPage.includes("form-info.html")) {
      return; // No hacemos validación aquí
    }

    // 1. Verificar usuario en localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      const stores = await api.getStores();
      const myStore = stores.find(s => String(s.owner_id) === String(user.id));

      // 2. Redirigir si tiene una store inactiva
      if (myStore && myStore.is_active === false) {
        window.location.href = `../pages/form-info-store.html?id=${myStore.id}`;
        return;
      }

      // 3. Renderizar listado de tiendas
      container.innerHTML = stores.map(s => `
        <div class="p-3 border rounded">
          <h2 class="font-bold">${s.name}</h2>
          <p>${s.description || "Sin descripción"}</p>
        </div>
      `).join("");

    } else {
      // Si no hay usuario, mostrar solo listado
      const stores = await api.getStores();
      container.innerHTML = stores.map(s => `
        <div class="p-3 border rounded">
          <h2 class="font-bold">${s.name}</h2>
          <p>${s.description || "Sin descripción"}</p>
        </div>
      `).join("");
    }

  } catch (err) {
    console.error("Error cargando tiendas:", err);
    if (container) {
      container.innerHTML = `<p class="text-red-600">Error cargando tiendas</p>`;
    }
  }
});
