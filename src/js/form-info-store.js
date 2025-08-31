import { api } from "../utils/api";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('update-store-form');
  const submitBtn = document.getElementById('submit-btn');
  const messageContainer = document.getElementById('message-container');

  const params = new URLSearchParams(window.location.search);
  const storeId = params.get('id');

  if (!storeId) {
    showMessage('No se encontró el ID de la guardería', 'error');
    form.style.display = "none";
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading">Actualizando...</span>';
    messageContainer.innerHTML = '';

    try {
      const formData = new FormData(form);
      const data = {
        business_name: formData.get('business_name').trim(),
        tax_id: formData.get('tax_id').trim(),
        business_license: formData.get('business_license').trim(),
        main_address: formData.get('main_address').trim(),
        official_phone: formData.get('official_phone').trim(),
        official_email: formData.get('official_email').trim(),
      };
console.log(123456);

      if (!data.business_name || !data.tax_id || !data.main_address) {
        throw new Error("Por favor complete todos los campos obligatorios");
      }

      await api.updateStore(storeId, data);

      showMessage("✅ Información actualizada correctamente", "success");

      window.location.href = "../pages/Adim.html"

    } catch (err) {
      console.error(err);
      showMessage(err.message || "❌ Error actualizando la información", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Actualizar Información";
    }
  });

  function showMessage(msg, type) {
    messageContainer.innerHTML = `<div class="message ${type}">${msg}</div>`;
  }

  
});
