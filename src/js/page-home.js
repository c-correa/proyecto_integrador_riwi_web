import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("stores-list");

  try {
    const currentPage = window.location.pathname;
    if (currentPage.includes("form-info.html")) return;

    const user = JSON.parse(localStorage.getItem("user"));
    const stores = await api.getStores();

    if (user && user.id) {
      const myStore = stores.find(s => String(s.owner_id) === String(user.id));
      if (myStore && myStore.is_active === false) {
        window.location.href = `../src/pages/form-info-store.html?id=${myStore.id}`;
        return;
      }
    }

    container.classList.add("stores-grid");

    container.innerHTML = stores.map(s => `
      <div class="store-card">
        <img 
          src="${s.logo || '../assets/default-store.png'}" 
          alt="${s.name}" 
          class="store-logo"
        />
        <h2 class="store-title">${s.name}</h2>
        <p class="store-description">${s.description || "Sin descripción disponible"}</p>
        <button 
          class="store-btn"
          onclick="window.location.href='../src/pages/store-detail.html?id=${s.id}'"
        >
          Ver tienda
        </button>
      </div>
    `).join("");

  } catch (err) {
    console.error("Error cargando tiendas:", err);
    if (container) {
      container.innerHTML = `<p class="error-text">Error cargando tiendas</p>`;
    }
  }
});
