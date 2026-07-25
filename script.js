/* ===================================================================
   Win With Dez — funnel behavior
   - Validates the opt-in email
   - Stores the lead locally (swap in your real endpoint below)
   - Redirects to the thank-you page on success
   =================================================================== */
(function () {
  "use strict";

  // Set the current year in the footer.
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Send the captured lead somewhere real.
   * By default we store it in localStorage so nothing is lost during setup.
   * Replace the body with a fetch() to your email provider / CRM, e.g.:
   *
   *   return fetch("https://your-endpoint.example/subscribe", {
   *     method: "POST",
   *     headers: { "Content-Type": "application/json" },
   *     body: JSON.stringify({ email: email })
   *   });
   */
  function submitLead(email) {
    try {
      var key = "wwd_leads";
      var leads = JSON.parse(localStorage.getItem(key) || "[]");
      leads.push({ email: email, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(leads));
    } catch (e) {
      /* localStorage may be unavailable (private mode) — ignore. */
    }
    return Promise.resolve();
  }

  function wireForm(form) {
    var input = form.querySelector('input[type="email"]');
    var errorEl = form.querySelector("[data-error]");
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (input.value || "").trim();

      if (!EMAIL_RE.test(email)) {
        if (errorEl) errorEl.hidden = false;
        input.focus();
        return;
      }
      if (errorEl) errorEl.hidden = true;

      var original = button.textContent;
      button.disabled = true;
      button.textContent = "Sending…";

      submitLead(email).then(function () {
        // Remember the email so the thank-you page can greet the visitor.
        try { sessionStorage.setItem("wwd_email", email); } catch (e) {}
        window.location.href = "thank-you.html";
      }).catch(function () {
        button.disabled = false;
        button.textContent = original;
        if (errorEl) {
          errorEl.hidden = false;
          errorEl.textContent = "Something went wrong. Please try again.";
        }
      });
    });

    // Clear the error as the user types.
    input.addEventListener("input", function () {
      if (errorEl) errorEl.hidden = true;
    });
  }

  var forms = document.querySelectorAll("[data-optin]");
  Array.prototype.forEach.call(forms, wireForm);
})();
