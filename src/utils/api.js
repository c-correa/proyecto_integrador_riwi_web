const BASE_URL = "http://localhost:3000"; // change to the real endpoint

// generic request function
async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error("API error:", err);
    // Throw error with clearer message for the UI
    throw new Error("Could not connect to the server. Please make sure the backend is running.");
  }
}

export const api = {
  // Stores
  getStores: () => request("/stores"),
  getStore: (id) => request(`/stores/${id}`),
  createStore: (data) =>
    request("/stores", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStore: (id, data) =>
    request(`/stores/${id}`, {
      method: "PATCH", // or PUT depending on your backend
      body: JSON.stringify(data),
    }),

  // Store branches
  getBranches: () => request("/store-branches"),
  getBranch: (id) => request(`/store-branches/${id}`),
  getBranchByStore: (id) => request(`/store-branches/by/${id}`),
  updateBranch: (id, data) =>   // 👈 NUEVO
    request(`/store-branches/${id}`, {
      method: "PATCH", // o PATCH según tu backend
      body: JSON.stringify(data),
    }),
createStoreBranch: (data) => 
  request("/store-branches", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  // Publications
  getPublications: () => request("/publications"),
  getPublication: (id) => request(`/publications/${id}`),

  // Owners
  getOwners: () => request("/owners"),
  getOwner: (id) => request(`/owners/${id}`),
  createOwner: (data) =>
    request("/owners", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Authentication
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // Search
  searchServices: (filters) =>
    request("/search", {
      method: "POST",
      body: JSON.stringify(filters),
    }),

   getDepartments: () => request("/departments"),

};
