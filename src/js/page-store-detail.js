import { api } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#store-detail-container");
  const branchesContainer = document.querySelector("#branches-container");

  // Tomar el ID de la URL
  const params = new URLSearchParams(window.location.search);
  const storeId = params.get("id");

  if (!storeId) {
    container.innerHTML = "<p class='error'>No se encontró el ID de la guardería</p>";
    return;
  }

  // Función para formatear número de teléfono para WhatsApp
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return null;
    // Remover espacios, guiones y paréntesis
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Si no empieza con +57 (código de Colombia), agregarlo
    if (!cleanPhone.startsWith('+57') && !cleanPhone.startsWith('57')) {
      return `+57${cleanPhone}`;
    }
    return cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;
  };

  // Función para crear enlace de WhatsApp
  const createWhatsAppLink = (phone, storeName, branchName) => {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    if (!formattedPhone) return null;
    
    const message = encodeURIComponent(
      `¡Hola! Me interesa conocer más sobre los servicios de ${storeName} - Sucursal ${branchName}. ¿Podrían brindarme más información? 🐾`
    );
    
    return `https://wa.me/${formattedPhone.replace('+', '')}?text=${message}`;
  };

  try {
    // 1. Obtener la tienda
    const store = await api.getStore(storeId);
    console.log(5, store);
    

    container.innerHTML = `
      <div class="store-detail-card">
        <h1>${store.name}</h1>
        <p><strong>Descripción:</strong> ${store.description || "Sin descripción"}</p>
        <p><strong>Dirección:</strong> ${store.address || "No especificada"}</p>
        <p><strong>Teléfono:</strong> ${store.phone || "No disponible"}</p>
        <p><strong>Email:</strong> ${store.email || "No disponible"}</p>
      </div>
    `;

    // 2. Obtener sucursales de esa tienda
    const allBranches = await api.getBranches();
    console.log(123, allBranches);
    
    const branches = allBranches.filter(b => String(b.store_id) === String(storeId));
    console.log(branches);

    if (!branches.length) {
      branchesContainer.innerHTML = `<p>No hay sucursales registradas para esta guardería 🐾</p>`;
      return;
    }

    // 3. Renderizar las sucursales con botones de WhatsApp
    branchesContainer.innerHTML = `
      <h2>Sucursales</h2>
      <div class="branches-grid">
        ${branches.map(branch => {
          const whatsappLink = createWhatsAppLink(branch.phone, store.name, branch.name);
          
          return `
            <div class="branch-card">
              <h3>${branch.name}</h3>
              <p><strong>Dirección:</strong> ${branch.address || "No especificada"}</p>
              <p><strong>Teléfono:</strong> ${branch.phone || "No disponible"}</p>
              ${whatsappLink ? `
                <a href="${whatsappLink}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="whatsapp-btn">
                  <span class="whatsapp-icon">📱Contactar por WhatsApp </span>
                </a>
              ` : `
                <div class="no-whatsapp">
                  <span>📵</span>
                  WhatsApp no disponible
                </div>
              `}
            </div>
          `;
        }).join("")}
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="error">⚠️ Error cargando la guardería</p>`;
  }
});