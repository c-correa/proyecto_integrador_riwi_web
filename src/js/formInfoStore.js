import { api } from "../utils/api";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('update-store-form');
  const submitBtn = document.getElementById('submit-btn');
  const messageContainer = document.getElementById('message-container');

  const params = new URLSearchParams(window.location.search);
  const storeId = params.get('id');

  // Handle form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading">Updating...</span>';
    messageContainer.innerHTML = '';

    try {
      // Collect form data
      const formData = new FormData(form);
      const data = {
        business_name: formData.get('business_name').trim(),
        tax_id: formData.get('tax_id').trim(),
        business_license: formData.get('business_license').trim(),
        main_address: formData.get('main_address').trim(),
        official_phone: formData.get('official_phone').trim(),
        official_email: formData.get('official_email').trim(),
      };

      // Validate required fields
      if (!data.business_name || !data.tax_id || !data.main_address) {
        throw new Error("Please fill out all required fields");
      }

      // Update store through API
      await api.updateStore(storeId, data);

      // Success message and redirect
      showMessage("Information updated successfully", "success");
      window.location.href = "../pages/adim.html";

    } catch (err) {
      // Error handling
      console.error(err);
      showMessage(err.message || "Error updating the information", "error");
    } finally {
      // Restore button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Update Information";
    }
  });

  // Display message in container
  function showMessage(msg, type) {
    messageContainer.innerHTML = `<div class="message ${type}">${msg}</div>`;
  }
});
