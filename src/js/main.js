import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#stores-container");
  if (!container) return;

  try {
    // 1. Verificar si el usuario está en localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      // 2. Buscar la store asociada al owner
      const stores = await api.getStores();
      const myStore = stores.find(store => String(store.owner_id) === String(user.id));

      if (myStore && myStore.is_active === false) {
        // 3. Redirigir si tiene store pero está inactiva
        window.location.href = "../pages/form-info-store.html";
        return;
      }
    }

    // Si no hay usuario o no aplica la validación → listar guarderías
    const stores = await api.getStores();

    if (!stores.length) {
      container.innerHTML = `<p>No hay guarderías registradas todavía 🐾</p>`;
      return;
    }

    // Construimos las tarjetas dinámicamente
    container.innerHTML = stores.map(store => `
      <div class="store-card">
        <h3>${store.name}</h3>
        <p>${store.description || "Sin descripción disponible"}</p>
        <p><strong>Dirección:</strong> ${store.address || "No especificada"}</p>
        <a href="../pages/store-detail.html?id=${store.id}" class="btn-detalle">Ver más</a>
      </div>
    `).join("");

  } catch (err) {
    console.error("Error cargando guarderías:", err);
    container.innerHTML = `<p class="error">⚠️ No se pudieron cargar las guarderías. Intenta más tarde.</p>`;
  }
});
