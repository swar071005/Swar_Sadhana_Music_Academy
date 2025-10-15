document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const message = document.querySelector("#message").value.trim();

    // Basic validation
    if (!name || !email || !message) {
      alert("⚠️ Please fill in all fields before submitting!");
      return;
    }

    // Optional: Simulate backend API request (you can replace later with fetch)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Show “Thank You” popup
    showThankYouPopup(name);

    // Reset form
    form.reset();
  });

  // ✅ Function to show popup
  function showThankYouPopup(name) {
    const popup = document.createElement("div");
    popup.className = "thankyou-popup fade-in";
    popup.innerHTML = `
      <div class="popup-content">
        <h2>🎵 Thank You!</h2>
        <p>Dear <strong>${name}</strong>, your message has been sent successfully.</p>
        <button id="closePopup">Close</button>
      </div>
    `;
    document.body.appendChild(popup);

    // Close popup when clicking button
    document.getElementById("closePopup").addEventListener("click", () => {
      popup.classList.add("fade-out");
      setTimeout(() => popup.remove(), 400);
    });

    // Auto-remove after 4 seconds
    setTimeout(() => popup.remove(), 4000);
  }
});
