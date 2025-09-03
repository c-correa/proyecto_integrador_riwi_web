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
        Go to Explorer
      </button>
      <button id="btn-logout" 
        class="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 shadow">
        Log Out
      </button>
    `;

    // Go to Explorer
    document.getElementById("btn-explorer").addEventListener("click", () => {
      window.location.href = "index.html"; // adjust if different
    });

    // Log Out
    document.getElementById("btn-logout").addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "index.html"; // redirect to login or home
    });
  }

  try {
    // --- Session IDs ---
    const ownerId = localStorage.getItem("owner_id");

    // --- 1. Load departments into select ---
    const departments = await api.getDepartments();
    departments.forEach(dep => {
      const opt = document.createElement("option");
      opt.value = dep.id;
      opt.textContent = dep.name;
      depSelect.appendChild(opt);
    });

    // --- 2. Get my store by owner ---
    const stores = await api.getStores();
    const myStore = stores.find(store => store.owner_id == ownerId);

    if (!myStore) {
      container.innerHTML = `<p class="text-gray-500">You don't have an associated store.</p>`;
      return;
    }

    // --- 3. Get all branches for that store ---
    const branches = await api.getBranchByStore(myStore.id);
    renderBranches(branches);

    // --- Open modal ---
    btnCreate.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    // --- Close modal ---
    btnCancel.addEventListener("click", () => {
      modal.classList.add("hidden");
      form.reset();
    });

    // --- Create branch ---
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newBranch = {
        name: document.getElementById("branch-name").value,
        address: document.getElementById("branch-address").value,
        department_id: document.getElementById("branch-department").value,
        store_id: myStore.id,
      };

      try {
        await api.createStoreBranch(newBranch);
        modal.classList.add("hidden");
        form.reset();

        // refresh branch list
        const updatedBranches = await api.getBranchByStore(myStore.id);
        renderBranches(updatedBranches);
      } catch (err) {
        console.error("Error creating branch:", err);
        alert("Branch could not be created.");
      }
    });

  } catch (err) {
    console.error("Error:", err);
    container.innerHTML = `<p class="text-red-500">Error loading data.</p>`;
  }
});
