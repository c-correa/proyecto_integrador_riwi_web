import { api } from "../utils/api"; 

// Store ID (in a real scenario this should come from login session or URL params)
const STORE_ID = 1;

async function loadProfile() {
  try {
    // Request to backend (endpoint can be /form/:id once implemented)
    const data = await api.getStore(STORE_ID); 
    // If you prefer using "form": const data = await request(`/form/${STORE_ID}`);

    // Render profile info
    document.getElementById("profile-name").textContent = data.daycare_name;
    document.getElementById("profile-location").textContent = `📍 ${data.daycare_direction}`;
    document.getElementById("profile-description").textContent = data.experience || "No description available";
    if (data.url) document.getElementById("profile-img").src = data.url;

    // Render gallery
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = ""; 
    if (data.gallery && data.gallery.length > 0) {
      data.gallery.forEach(img => {
        const image = document.createElement("img");
        image.src = img;
        image.alt = "Daycare photo";
        gallery.appendChild(image);
      });
    } else {
      gallery.innerHTML = "<p>No photos uploaded yet.</p>";
    }

    // Render services
    const services = document.getElementById("services");
    services.innerHTML = "";
    if (data.services && data.services.length > 0) {
      data.services.forEach(service => {
        const li = document.createElement("li");
        li.textContent = service;
        services.appendChild(li);
      });
    } else {
      services.innerHTML = "<li>No services registered.</li>";
    }

  } catch (err) {
    console.error("Error loading profile:", err);
  }
}

// Init profile load
loadProfile();
