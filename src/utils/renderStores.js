import { api } from "./api.js";

export function renderBranches(branches = []) {
  const container = document.querySelector("#branches-container");

  // Modal crear
  const createModal = document.getElementById("branch-modal");
  const createForm = document.getElementById("branch-form");

  // Modal editar
  const editModal = document.getElementById("edit-branch-modal");
  const editForm = document.getElementById("edit-branch-form");

  // Campos del modal editar
  const inputName = document.getElementById("branch-name");
  const inputDescription = document.getElementById("branch-description");
  const inputAddress = document.getElementById("branch-address");
  const inputPhone = document.getElementById("branch-phone");
  const inputDepartment = document.getElementById("branch-department");
  const hiddenId = document.getElementById("branch-id");

  container.innerHTML = "";

  if (!branches || branches.length === 0) {
    container.innerHTML = `<p class="text-gray-500">⚠️ No tienes sucursales registradas.</p>`;
    return;
  }

  branches.forEach(branch => {
    const card = document.createElement("div");
    card.className =
      "p-4 mb-4 bg-white shadow-lg rounded-2xl border border-gray-100 flex flex-col justify-between";

    card.innerHTML = `
      <div>
        <h3 class="text-xl font-bold text-gray-800">${branch.name}</h3>
        <p class="text-sm text-gray-500 mt-1">${branch.address}</p>
        <p class="text-sm text-gray-400">${branch.phone || ""}</p>
        <p class="text-sm text-gray-400">${branch.description || ""}</p>
        <p class="mt-2 text-sm font-medium ${
          branch.is_active ? "text-green-600" : "text-red-600"
        }">
          ${branch.is_active ? "✅ Activa" : "⛔ Inactiva"}
        </p>
      </div>
      
      <div class="flex gap-3 mt-4">
        <button data-action="toggle" data-id="${branch.id}" 
          class="flex-1 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 transition text-white font-medium">
          ${branch.is_active ? "Desactivar" : "Activar"}
        </button>
        <button data-action="edit" data-id="${branch.id}" 
          class="flex-1 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition text-white font-medium">
          Editar
        </button>
        <button data-action="delete" data-id="${branch.id}" 
          class="flex-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition text-white font-medium">
          Eliminar
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  // --- Eventos para los botones ---
  container.querySelectorAll("button").forEach(btn => {
    const id = btn.dataset.id;
    const action = btn.dataset.action;

    btn.addEventListener("click", async () => {
      if (action === "toggle") {
        try {
          const branch = branches.find(b => b.id == id);
          await api.updateBranch(id, { is_active: !branch.is_active });
          location.reload();
        } catch (err) {
          alert("⚠️ No se pudo actualizar el estado.");
          console.error(err);
        }
      }

      if (action === "delete") {
        if (confirm("¿Seguro que deseas eliminar esta sucursal?")) {
          try {
            await api.updateBranch(id, { deleted_at: new Date() }); 
            location.reload();
          } catch (err) {
            alert("⚠️ No se pudo eliminar la sucursal.");
            console.error(err);
          }
        }
      }

      if (action === "edit") {
        const branch = branches.find(b => b.id == id);
        if (!branch) return;

        // 👇 Prellenar modal de EDITAR
        hiddenId.value = branch.id;
        inputName.value = branch.name || "";
        inputDescription.value = branch.description || "";
        inputAddress.value = branch.address || "";
        inputPhone.value = branch.phone || "";
        inputDepartment.value = branch.department_id || "";

        // Abrir modal editar
        editModal.classList.remove("hidden");

        // Cambiar comportamiento del form de editar
        editForm.onsubmit = async (e) => {
          e.preventDefault();

          try {
            await api.updateBranch(branch.id, {
              name: inputName.value,
              description: inputDescription.value,
              address: inputAddress.value,
              phone: inputPhone.value,
              department_id: inputDepartment.value,
            });

            editModal.classList.add("hidden");
            editForm.reset();
            location.reload(); 
          } catch (err) {
            console.error("Error actualizando sucursal:", err);
            alert("⚠️ No se pudo actualizar la sucursal.");
          }
        };
      }
    });
  });

  // --- Botón cancelar en modal editar ---
  document.getElementById("close-edit-branch").addEventListener("click", () => {
    editModal.classList.add("hidden");
    editForm.reset();
  });
}
