import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#stores-container");
  const header = document.getElementById("header");
  if (!container || !header) return;

  try {
    // 1. Verificar si el usuario está en localStorage
    const owner = JSON.parse(localStorage.getItem("owner_id"));
    console.log("Owner:", owner);

    if (owner) {
      const stores = await api.getStores();
      const myStore = stores.find(store => String(store.owner_id) === String(owner));

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
        <a href="../src/pages/storeDetail.html?id=${store.id}" class="btn-detalle">Ver más</a>
      </div>
    `).join("");
      }
    };

    // 3. Pedir sucursales (departments) y renderizar select dinámico
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

      // Escuchar cambios en el select
      select.addEventListener("change", e => {
        if (e.target.value) {
          localStorage.setItem("department_id", e.target.value);
          renderStores(e.target.value); // Filtrar por departamento
        } else {
          localStorage.removeItem("department_id");
          renderStores(); // Mostrar todas
        }
      });

      // Recuperar valor guardado si existe
      const savedDep = localStorage.getItem("department_id");
      if (savedDep) {
        select.value = savedDep;
        await renderStores(savedDep); // Mostrar filtradas al cargar
      } else {
        await renderStores(); // Mostrar todas
      }

      // Insertar ANTES del header
      header.insertAdjacentElement("beforebegin", select);
    } else {
      // Si no hay departamentos en la API
      await renderStores();
    }

  } catch (err) {
    console.error("Error cargando guarderías:", err);
    container.innerHTML = `<p class="error">⚠️ No se pudieron cargar las guarderías. Intenta más tarde.</p>`;
  }
});
