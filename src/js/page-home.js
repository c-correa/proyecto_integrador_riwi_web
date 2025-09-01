import { api } from "../utils/api";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#stores-container");
  const navRight = document.querySelector(".nav-right");

  if (!container) return;

  try {
    const userId = localStorage.getItem("owner_id"); // ahora solo guardas el ID
    let user = null;

    if (userId) {
      // consultar el usuario por ID en la API
      user = await api.getOwner(userId);
      console.log("Usuario cargado:", user);

      if (user) {
        const stores = await api.getStores();
        const myStore = stores.find(store => String(store.owner_id) === String(user.id));

        if (myStore) {
          if (!myStore.is_active) {
            // store existe pero inactiva → redirigir
            window.location.href = "../pages/form-info-store.html";
            return;
          } else {
            // store activa → redirigir
            window.location.href = "../pages/admin.html";
            return;
          }
        }
      }
    }

    // --- si no hay usuario o no aplica la validación → listar guarderías
    const stores = await api.getStores();

    if (!stores.length) {
      container.innerHTML = `<p>No hay guarderías registradas todavía 🐾</p>`;
      return;
    }

    container.innerHTML = stores.map(store => `
      <div class="store-card">
        <h3>${store.name}</h3>
        <p>${store.description || "Sin descripción disponible"}</p>
        <p><strong>Dirección:</strong> ${store.address || "No especificada"}</p>
        <a href="../pages/store-detail.html?id=${store.id}" class="btn-detalle">Ver más</a>
      </div>
    `).join("");

    // 🔥 si el user tiene una store activa → botón al header
    if (user && stores.some(s => String(s.owner_id) === String(user.id) && s.is_active)) {
      const adminLink = document.createElement("a");
      adminLink.href = "../pages/admin.html";
      adminLink.className = "nav-link";
      adminLink.textContent = "Vista Administradora";
      navRight.appendChild(adminLink);
    }

  } catch (err) {
    console.error("Error cargando guarderías:", err);
    container.innerHTML = `<p class="error">⚠️ No se pudieron cargar las guarderías. Intenta más tarde.</p>`;
  }
});
