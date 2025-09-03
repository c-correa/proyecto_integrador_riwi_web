import { api } from "../utils/api.js";
import { renderBranches } from "../utils/renderStoresBranch.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#branches-container");
  const btnCreate = document.getElementById("btn-create-branch");
  const modal = document.getElementById("branch-modal");
  const form = document.getElementById("branch-form");
  const depSelect = document.getElementById("branch-department");
  const btnCancel = document.getElementById("btn-cancel");
  const headerContainer = document.getElementById("header");

  if (!container) return;


  if (headerContainer) {
  headerContainer.innerHTML = `
    <button id="btn-explorer" 
      class="px-3 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 shadow">
      Ir a explorador
    </button>
    <button id="btn-logout" 
      class="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 shadow">
      Cerrar sesión
    </button>
  `;

  // 🔹 Ir a explorador
  document.getElementById("btn-explorer").addEventListener("click", () => {
    window.location.href = "index.html"; // 👈 ajusta el nombre si es distinto
  });

  // 🔹 Cerrar sesión
  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.clear(); // borra todo el storage
    window.location.href = "index.html"; // redirigir al login o página principal
  });
}


  try {
    // --- IDs de sesión ---
    const ownerId = localStorage.getItem("owner_id");

    // --- 1. Cargar departamentos en el select (siempre disponible) ---
    const departments = await api.getDepartments();
    departments.forEach(dep => {
      const opt = document.createElement("option");
      opt.value = dep.id;
      opt.textContent = dep.name;
      depSelect.appendChild(opt);
    });

    // --- 2. Obtener mi store por owner ---
    const stores = await api.getStores();
    const myStore = stores.find(store => store.owner_id == ownerId);

    if (!myStore) {
      container.innerHTML = `<p class="text-gray-500">⚠️ No tienes una tienda asociada.</p>`;
      return;
    }

    // --- 3. Obtener todas las branches de esa store ---
    const branches = await api.getBranchByStore(myStore.id);
    renderBranches(branches);

    // --- Abrir modal ---
    btnCreate.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    // --- Cerrar modal ---
    btnCancel.addEventListener("click", () => {
      modal.classList.add("hidden");
      form.reset();
    });

    // --- Crear sucursal ---
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newBranch = {
        name: document.getElementById("branch-name").value,
        address: document.getElementById("branch-address").value,
        department_id: document.getElementById("branch-department").value,
        store_id: myStore.id, // 🔑 asociar a la store del owner
      };

      try {
        await api.createStoreBranch(newBranch);
        modal.classList.add("hidden");
        form.reset();

        // refrescar listado
        const updatedBranches = await api.getBranchByStore(myStore.id);
        renderBranches(updatedBranches);
      } catch (err) {
        console.error("Error creando sucursal:", err);
        alert("⚠️ No se pudo crear la sucursal.");
      }
    });

  } catch (err) {
    console.error("Error:", err);
    container.innerHTML = `<p class="text-red-500">Error cargando datos.</p>`;
  }
});
