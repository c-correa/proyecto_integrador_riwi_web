// Configuración dinámica de URL según el entorno
const BASE_URL = import.meta.env.DEV 
  ? "https://proyecto-integrador-riwi-api.onrender.com"  // URL de producción para desarrollo
  : "https://proyecto-integrador-riwi-api.onrender.com"; // URL de producción para build

// función genérica para peticiones
async function request(path, options = {}) {
  try {
    const url = `${BASE_URL}${path}`;
    console.log(`�� Making request to: ${url}`);
    
    const res = await fetch(url, {
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      ...options,
    });

    console.log(`📡 Response status: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ API Error ${res.status}:`, errorText);
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log(`✅ API Success:`, data);
    return data;
  } catch (err) {
    console.error("🚨 API error:", err);
    // Lanzar error con mensaje más claro para la UI
    throw new Error(`No se pudo conectar al servidor (${BASE_URL}). Error: ${err.message}`);
  }
}

export const api = {
  // Health check
  healthCheck: () => request("/health"),
  
  // Stores
  getStores: () => request("/stores"),
  getStore: (id) => request(`/stores/${id}`),
  createStore: (data) => request("/stores", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  updateStore: (id, data) =>   // 👈 NUEVO
    request(`/stores/${id}`, {
      method: "PATCH", // o PATCH según tu backend
      body: JSON.stringify(data),
    }),


  // Store branches
  getBranches: () => request("/store-branches"),
  getBranch: (id) => request(`/store-branches/${id}`),
  getBranchBySotre: (id) => request(`/store-branches/by/${id}`),
  updateBranche: (id, data) =>   // 👈 NUEVO
    request(`/store-branches/${id}`, {
      method: "PATCH", // o PATCH según tu backend
      body: JSON.stringify(data),
    }),


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
