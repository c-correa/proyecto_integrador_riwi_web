import { api } from "../utils/api.js";

async function renderStores(departmentId = null) {
  const container = document.querySelector("#stores-container");
  if (!container) return;

  try {
    let stores = await api.getStores();

    // Filtrar por departamento si aplica
    if (departmentId) {
      stores = stores.filter(store => String(store.department_id) === String(departmentId));
    }

    if (!stores.length) {
      container.innerHTML = `<p>No hay guarderías registradas todavía 🐾</p>`;
      return;
    }

    // Renderizar tarjetas
    container.innerHTML = stores.map(store => `
      <div class="store-card">
        <h3>${store.name}</h3>
        <p>${store.description || "Sin descripción disponible"}</p>
        <p><strong>Dirección:</strong> ${store.address || "No especificada"}</p>
        <a href="../src/pages/storeDetail.html?id=${store.id}" class="btn-detalle">Ver más</a>
      </div>
    `).join("");
  } catch (err) {
    console.error("Error renderizando guarderías:", err);
    container.innerHTML = `<p class="error">⚠️ No se pudieron cargar las guarderías. Intenta más tarde.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const header = document.getElementById("header");
  if (!header) return;

  try {
    // Verificar si hay un owner
    const owner = JSON.parse(localStorage.getItem("owner_id"));
    console.log("Owner:", owner);

    if (owner) {
      const stores = await api.getStores();
      const myStore = stores.find(store => String(store.owner_id) === String(owner));

      if (myStore && myStore.is_active === false) {
        window.location.href = "../pages/form-info-store.html";
        return;
      }
    }

    // Pedir departamentos
    const departments = await api.getDepartments();
    if (departments && departments.length) {
      const select = document.createElement("select");
      select.className = "border rounded px-2 py-1";

      const defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.textContent = "Selecciona una sucursal";
      select.appendChild(defaultOpt);

      departments.forEach(department => {
        const opt = document.createElement("option");
        opt.value = department.id;
        opt.textContent = department.name;
        select.appendChild(opt);
      });

      // Listener para el select
      select.addEventListener("change", e => {
        if (e.target.value) {
          localStorage.setItem("department_id", e.target.value);
          renderStores(e.target.value);
        } else {
          localStorage.removeItem("department_id");
          renderStores();
        }
      });

      // Recuperar valor guardado si existe
      const savedDep = localStorage.getItem("department_id");
      if (savedDep) {
        select.value = savedDep;
        await renderStores(savedDep);
      } else {
        await renderStores();
      }

      // Insertar el select antes del header
      header.insertAdjacentElement("beforebegin", select);
    } else {
      // No hay departamentos → mostrar todas las guarderías
      await renderStores();
    }

  } catch (err) {
    console.error("Error cargando datos iniciales:", err);
  }
});
