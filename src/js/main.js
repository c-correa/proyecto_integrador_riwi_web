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
        window.location.href = "../pages/form-info-store.html";
        return;
      }
    }

    // 2. Renderizar botones en el header
    header.innerHTML = `
      <a href=${owner ? "./src/pages/admin.html" : "./src/pages/login.html"} 
         class="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50">
         ${owner ? "Dashboard" : "Iniciar sesión"}
      </a>
      <a href=${owner ? "./index.html" : "../pages/register.html"} 
         class="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"> 
         ${owner ? "Explorar" : "Inscribete"}
      </a>
    `;

    // Función para renderizar stores con filtro por departamento
    const renderStores = async (departmentId = null) => {
      const stores = await api.getStores();
      let filtered = stores;

      if (departmentId) {
        filtered = stores.filter(store => String(store.department_id) === String(departmentId));
      }

      if (!filtered.length) {
        container.innerHTML = `<p class="text-gray-600">🐾 No hay sucursales disponibles en esta ubicación.</p>`;
      } else {
           container.innerHTML = stores.map(store => `
      <div class="bg-white border-2 border-gray-200 shadow-lg rounded-2xl p-6 hover:shadow-2xl hover:border-gray-300 transition duration-300">
        <h3 class="text-xl font-bold text-gray-900 mb-3">${store.name}</h3>
        <p class="text-gray-600 mb-3">${store.description || "Sin descripción disponible"}</p>
        <p class="text-gray-700 mb-5">
          <strong class="font-medium">Dirección:</strong> ${store.address || "No especificada"}
        </p>
        <a href="../src/pages/storeDetail.html?id=${store.id}" 
           class="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Ver más
        </a>
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
    console.error("Error cargando datos dinámicos:", err);
    container.innerHTML = `<p class="error">⚠️ No se pudieron cargar los datos. Intenta más tarde.</p>`;
  }
});
