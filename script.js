/* ===================================================================
   Win With Dez — funnel behavior
   - Validates the opt-in email
   - Subscribes the lead to Kit (ConvertKit) form 9723242, which feeds the
     "Win With Dez — Nurture" sequence via the account's automation Rule
   - Redirects to the thank-you page on success
   =================================================================== */
(function () {
  "use strict";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Set the current year in the footer.
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /**
   * Subscribe the lead to Kit by POSTing the form to its subscriptions
   * endpoint (form action = https://app.kit.com/forms/9723242/subscriptions).
   * No backend and no API key are needed — this is Kit's public form endpoint,
   * the same one the live landing page uses. Kit's automation Rule then adds
   * the subscriber to the "Win With Dez — Nurture" sequence.
   *
   * Resolves on success; rejects on error. If JS is disabled the form still
   * POSTs natively to the same action URL (progressive enhancement).
   */
  function submitLead(form) {
    return fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && (!result.data || result.data.status !== "error")) return;
        throw new Error("Subscription failed. Please try again in a moment.");
      });
  }

  function wireForm(form) {
    var input = form.querySelector('input[type="email"]');
    var errorEl = form.querySelector("[data-error]");
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (input.value || "").trim();

      if (!EMAIL_RE.test(email)) {
        if (errorEl) {
          errorEl.textContent = "Please enter a valid email address.";
          errorEl.hidden = false;
        }
        input.focus();
        return;
      }
      if (errorEl) errorEl.hidden = true;

      var original = button.textContent;
      button.disabled = true;
      button.textContent = "Sending…";

      submitLead(form).then(function () {
        // Remember the email so the thank-you page can greet the visitor.
        try { sessionStorage.setItem("wwd_email", email); } catch (e) {}
        window.location.href = "thank-you.html";
      }).catch(function (err) {
        button.disabled = false;
        button.textContent = original;
        if (errorEl) {
          errorEl.textContent = (err && err.message) || "Something went wrong. Please try again.";
          errorEl.hidden = false;
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
