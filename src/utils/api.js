const BASE_URL = "http://localhost:3000"; // cambia al endpoint real

// función genérica para peticiones
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
    // Lanzar error con mensaje más claro para la UI
    throw new Error("No se pudo conectar al servidor. Comprueba que el backend esté en ejecución.");
  }
}

export const api = {
  // Stores
  getStores: () => request("/stores"),
  getStore: (id) => request(`/stores/${id}`),
  createStore: (data) => request("/stores", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  // Store branches
  getBranches: () => request("/store-branches"),
  getBranch: (id) => request(`/store-branches/${id}`),

  // Publications
  getPublications: () => request("/publications"),
  getPublication: (id) => request(`/publications/${id}`),

  // Owners
  getOwners: () => request("/owners"),
  getOwner: (id) => request(`/owners/${id}`),
  createOwner: (data) => request("/owners", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  // Authentication
  login: (credentials) => request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  }),

  // Search
  searchServices: (filters) => request("/search", {
    method: "POST",
    body: JSON.stringify(filters),
  }),

  // Kennel registration
  registerKennel: (data) => request("/kennels/register", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};
