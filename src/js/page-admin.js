import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#guarderias-container");

  // --- Modal Branch ---
  const branchModal = document.querySelector("#branch-modal");
  const branchForm = document.querySelector("#branch-form");
  const branchModalTitle = document.querySelector("#branch-modal-title");

  let editingBranchId = null;

  // Abrir/Cerrar modales
  function openModal(modal) {
    modal.classList.add("open");
  }
  function closeModal(modal) {
    modal.classList.remove("open");
  }
  document.querySelectorAll(".modal-close").forEach((btn) =>
    btn.addEventListener("click", () => closeModal(branchModal))
  );

  // --- Cargar Branches ---
  async function loadBranches() {
    container.innerHTML = `<p class="loading">Cargando sucursales...</p>`;
    try {
      const ownerId = localStorage.getItem("owner_id");
      if (!ownerId) {
        container.innerHTML = `<p class="error">⚠️ No se encontró un owner_id</p>`;
        return;
      }

      // 1. Buscar stores del owner
      const stores = await api.getStores();
      const myStores = stores.filter((s) => String(s.owner_id) === String(ownerId));
      console.log(myStores);

      if (!myStores.length) {
        container.innerHTML = `<p>No tienes tiendas asociadas todavía 🐾</p>`;
        return;
      }

      // 2. Obtener branches de esas stores
      let allBranches = [];
for (const store of myStores) {
  const res = await api.getBranchBySotre(store.id);
  console.log("Branches API response:", res);

  // Si devuelve un objeto simple lo convertimos en array
  const list = Array.isArray(res) ? res : (res ? [res] : []);
  allBranches.push(...list.map((b) => ({ ...b, store })));
}



      if (!allBranches.length) {
        container.innerHTML = `<p>No tienes sucursales registradas aún.</p>`;
        return;
      }

      console.log(allBranches);
      

      // 3. Render solo sucursales
      container.innerHTML = allBranches
        .map(
          (b) => `
          <article class="card ${b.is_active ? "active" : "inactive"}" data-id="${b.id}">
            <div class="card-header">
              <div class="card-img">🏪</div>
              <div class="card-info">
                <h2>${b.name}</h2>
                <span class="status-badge ${b.is_active ? "active" : "inactive"}">
                  ${b.is_active ? "Activa" : "Inactiva"}
                </span>
              </div>
            </div>
            <div class="card-body">
              <p><strong>📍 Dirección:</strong> ${b.address || "No especificada"}</p>
              <p><strong>📱 Teléfono:</strong> ${b.phone || "Sin teléfono"}</p>
              <p>${b.description || "Sin descripción"}</p>
              <p class="store-ref"><em>De la tienda: ${b.store.name}</em></p>

              <div class="actions">
                <button class="btn secondary btn-edit-branch" data-id="${b.id}">Editar</button>
                <button class="btn ${b.is_active ? "danger" : "approve"} btn-toggle-branch" data-id="${b.id}">
                  ${b.is_active ? "Desactivar" : "Activar"}
                </button>
                <button class="btn danger btn-delete-branch" data-id="${b.id}">Eliminar</button>
              </div>
            </div>
          </article>
        `
        )
        .join("");

      bindBranchEvents();
    } catch (err) {
      console.error("Error cargando sucursales:", err);
      container.innerHTML = `<p class="error">⚠️ Error al cargar las sucursales.</p>`;
    }
  }

  // Eventos de botones dinámicos
  function bindBranchEvents() {
    document.querySelectorAll(".btn-edit-branch").forEach((btn) =>
      btn.addEventListener("click", () => openEditBranchModal(btn.dataset.id))
    );
    document.querySelectorAll(".btn-toggle-branch").forEach((btn) =>
      btn.addEventListener("click", () => toggleBranch(btn.dataset.id))
    );
    document.querySelectorAll(".btn-delete-branch").forEach((btn) =>
      btn.addEventListener("click", () => deleteBranch(btn.dataset.id))
    );
  }

  // --- Branch logic ---
  function openNewBranchModal(storeId) {
    editingBranchId = null;
    branchModalTitle.textContent = "Nueva Sucursal";
    branchForm.reset();
    branchForm.dataset.storeId = storeId;
    openModal(branchModal);
  }
  async function openEditBranchModal(id) {
    editingBranchId = id;
    const b = await api.getBranch(id);
    branchModalTitle.textContent = "Editar Sucursal";
    document.querySelector("#branch-name").value = b.name || "";
    document.querySelector("#branch-description").value = b.description || "";
    document.querySelector("#branch-address").value = b.address || "";
    document.querySelector("#branch-phone").value = b.phone || "";
    document.querySelector("#branch-active").value = String(b.is_active);
    openModal(branchModal);
  }
  async function toggleBranch(id) {
    const b = await api.getBranch(id);
    await api.updateBranch(id, { is_active: !b.is_active });
    loadBranches();
  }
  async function deleteBranch(id) {
    if (confirm("¿Eliminar esta sucursal?")) {
      await api.deleteBranch(id);
      loadBranches();
    }
  }

  branchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: document.querySelector("#branch-name").value,
      description: document.querySelector("#branch-description").value,
      address: document.querySelector("#branch-address").value,
      phone: document.querySelector("#branch-phone").value,
      is_active: document.querySelector("#branch-active").value === "true",
      store_id: branchForm.dataset.storeId, // se mantiene vínculo a la store
    };
    if (editingBranchId) {
      await api.updateBranch(editingBranchId, data);
    } else {
      await api.createBranch(data);
    }
    closeModal(branchModal);
    loadBranches();
  });

  // Inicial
  loadBranches();
});
