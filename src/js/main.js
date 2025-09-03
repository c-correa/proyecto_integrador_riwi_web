import { api } from "../utils/api.js";

async function renderStores(departmentId = 2) {
  const container = document.querySelector("#stores-container");
  if (!container) return;
  const header = document.getElementById("header");

  try {
    let stores = await api.getStores();

    if (departmentId) {
      stores = stores.filter(store => String(store.department_id) === String(departmentId));
    }

    console.log("Filtered stores:", stores); // <-- aquí puedes verificar los resultados

container.innerHTML = stores.length
  ? stores.map(store => `
    <div class="store-card bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <h3 class="text-xl font-semibold text-indigo-700 mb-2">${store.name}</h3>
      <p class="text-gray-600 mb-2">${store.description || "No description available"}</p>
      <p class="text-sm text-gray-500 mb-4">
        <strong class="text-gray-700">Address:</strong> ${store.address || "Not specified"}
      </p>
      <a href="../src/pages/storeDetail.html?id=${store.id}" 
         class="inline-block mt-auto px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors duration-200">
        See more
      </a>
    </div>
  `).join("")
  : `<p class="text-gray-500 italic">There are no registered daycare centers yet.</p>`;


  } catch (err) {
    console.error("Error rendering nurseries:", err);
    container.innerHTML = `<p class="error">The daycare centers could not be loaded. Please try again later.</p>`;
  }
}


document.addEventListener("DOMContentLoaded", async () => {
  const header = document.getElementById("header");
  if (!header) return;

  try {
    const owner = JSON.parse(localStorage.getItem("owner_id"));
    const stores = await api.getStores();
    const departments = await api.getDepartments();
    let savedDep = localStorage.getItem("department_id");
    localStorage.setItem("count", 1);
    let count = localStorage.getItem("count");

    // Find the owner's store
    let myStore = null;
    if (owner) {
      myStore = stores.find(store => String(store.owner_id) === String(owner));
      // Redirect if the store is inactive
      // if (myStore && myStore.is_active === false && count == 1) {
      //   window.location.replace(`../pages/formInfoStore.html?id=${myStore.id}`);
      //   return;
      // }
    }

    let headerHTML = "";

    if (owner) {
      // Dashboard
      headerHTML += `
        <a href=${myStore.is_active == false ? `./src/pages/formInfoStore.html?id=${myStore.id}`:  "./src/pages/admin.html"} 
           class="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50">
          ${myStore.is_active == false ? "Complete profile" :  "Dashboard" } 
        </a>
      `;

      // Explorer
      headerHTML += `
        <a href="../index.html"
           class="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
           Explorer
        </a>
      `;

      // Log out
      headerHTML += `
        <button id="btn-logout"
                class="px-3 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600">
           Cerrar sesión
        </button>
      `;
    } else {
      // Views for visint
      headerHTML += `
        <a href="../../src/pages/login.html"
           class="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50">
           Iniciar sesión
        </a>
        <a href="../../src/pages/register.html"
           class="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
           Inscribete
        </a>
      `;
    }

    header.innerHTML = headerHTML;

    // Function for log out
    const logoutBtn = document.getElementById("btn-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.replace("../index.html");
      });
    }

    //  Initial rendering of stores
    const initialStores = savedDep
      ? stores.filter(s => String(s.department_id) === String(savedDep))
      : stores;
renderStores(savedDep);

    // Create a selection of departments
    if (departments && departments.length) {
      const select = document.createElement("select");
      select.className = "border rounded px-2 py-1";

      select.innerHTML = `<option value="">Select a branch</option>` +
        departments.map(d => `<option value="${d.id}">${d.name}</option>`).join("");

      if (savedDep) select.value = savedDep;

   select.addEventListener("change", e => {
  e.preventDefault();
  const depId = e.target.value;

  if (depId) {
    localStorage.setItem("department_id", depId);
  } else {
    localStorage.removeItem("department_id");
  }

  // ✅ Renderiza directamente usando el nuevo valor del select
  renderStores(depId || 2);
});

      header.insertAdjacentElement("beforebegin", select);
    }

  } catch (err) {
    console.error("Error loading initial data:", err);
  }
});
