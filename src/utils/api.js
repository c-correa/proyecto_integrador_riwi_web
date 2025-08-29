const BASE_URL = "http://localhost:3000"; // cambia al endpoint real

// función genérica para peticiones
async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    return await res.json();
  } catch (err) {
    console.error("API error:", err);
    throw err;
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
};
