import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#store-detail-container");
  const branchesContainer = document.querySelector("#branches-container");

  // Get the ID from the URL
  const params = new URLSearchParams(window.location.search);
  const storeId = params.get("id");

  if (!storeId) {
    container.innerHTML =
      "<p class='error'>Store ID not found</p>";
    return;
  }

  // Function to format phone number for WhatsApp
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return null;
    // Remove spaces, dashes, and parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    // If it doesn't start with +57 (Colombian code), add it
    if (!cleanPhone.startsWith("+57") && !cleanPhone.startsWith("57")) {
      return `+57${cleanPhone}`;
    }
    return cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`;
  };

  // Function to create WhatsApp link
  const createWhatsAppLink = (phone, storeName, branchName) => {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    if (!formattedPhone) return null;

    const message = encodeURIComponent(
      `Hi! I'm interested in learning more about the services of ${storeName} - Branch ${branchName}. Could you provide more information? 🐾`
    );

    return `https://wa.me/${formattedPhone.replace("+", "")}?text=${message}`;
  };

  try {
    // 1. Get the store
    const store = await api.getStore(storeId);
    console.log(5, store);

    container.innerHTML = `
      <div class="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h1 class="text-2xl font-bold text-blue-700 mb-4">${store.name}</h1>

        <p class="text-gray-700 text-sm mb-2">
          <span class="font-semibold text-gray-900">Description:</span>
          ${store.description || "No description"}
        </p>

        <p class="text-gray-700 text-sm mb-2">
          <span class="font-semibold text-gray-900">Address:</span>
          ${store.address || "Not specified"}
        </p>

        <p class="text-gray-700 text-sm mb-2">
          <span class="font-semibold text-gray-900">Phone:</span>
          ${store.phone || "Not available"}
        </p>

        <p class="text-gray-700 text-sm">
          <span class="font-semibold text-gray-900">Email:</span>
          ${store.email || "Not available"}
        </p>
      </div>
    `;

    // 2. Get the store's branches
    const allBranches = await api.getBranches();
    console.log(123, allBranches);

    const branches = allBranches.filter(
      (b) => String(b.store_id) === String(storeId)
    );
    console.log(branches);

    if (!branches.length) {
      branchesContainer.innerHTML = `<p>No branches registered for this store 🐾</p>`;
      return;
    }

    // 3. Render the branches with WhatsApp buttons
    branchesContainer.innerHTML = `
      <h2>Branches</h2>
      <div class="branches-grid">
        ${branches
          .map((branch) => {
            const whatsappLink = createWhatsAppLink(
              branch.phone,
              store.name,
              branch.name
            );

            return `
              <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-transform">
                <h3 class="text-blue-600 text-lg font-semibold mb-2">${branch.name}</h3>
                <p class="text-gray-700 text-sm mb-1">
                  <span class="font-bold text-gray-900">Address:</span> ${
                    branch.address || "Not specified"
                  }
                </p>
                <p class="text-gray-700 text-sm mb-1">
                  <span class="font-bold text-gray-900">Phone:</span> ${
                    branch.phone || "Not available"
                  }
                </p>
                ${
                  whatsappLink
                    ? `
                  <a href="${whatsappLink}" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     class="inline-flex items-center gap-2 mt-3 px-5 py-2 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 hover:shadow-md hover:-translate-y-1 active:bg-green-700 transition-all">
                    <span>Contact via WhatsApp</span>
                  </a>
                `
                    : `
                  <div class="flex items-center gap-2 text-sm text-gray-500 mt-3">
                    <span>WhatsApp not available</span>
                  </div>
                `
                }
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="error">⚠️ Error loading store information</p>`;
  }
});
