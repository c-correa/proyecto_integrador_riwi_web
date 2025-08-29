import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("stores-list");

  try {
    const stores = await api.getStores();
    container.innerHTML = stores.map(s => `
      <div class="p-3 border rounded">
        <h2 class="font-bold">${s.name}</h2>
        <p>${s.description || "Sin descripción"}</p>
      </div>
    `).join("");
  } catch (err) {
    container.innerHTML = `<p class="text-red-600">Error cargando tiendas</p>`;
  }
});
