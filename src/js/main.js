import { api } from "../utils/api";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#stores-container");
  if (!container) return;

  try {
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
