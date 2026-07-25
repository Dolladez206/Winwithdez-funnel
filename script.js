/* ===================================================================
   Win With Dez — funnel behavior
   - Validates the opt-in email
   - Subscribes the lead to Mailchimp (no backend needed, via JSONP)
   - Redirects to the thank-you page on success
   =================================================================== */
(function () {
  "use strict";

  /* -------------------------------------------------------------------
     MAILCHIMP SETUP  ——  paste ONE value and you're live.

     1. Log in to Mailchimp → Audience → Sign up forms → "Embedded form".
     2. Copy the URL inside <form action="..."> (it ends in
        /subscribe/post?u=XXXX&id=YYYY).
     3. Paste it below as MAILCHIMP_URL.

     That's it — this script converts it to Mailchimp's JSONP endpoint
     automatically, so it works on a plain static site with no server.
     Leave it as "" during setup and emails are saved to localStorage
     instead (nothing is lost).
  ------------------------------------------------------------------- */
  var MAILCHIMP_URL = ""; // e.g. "https://gmail.us21.list-manage.com/subscribe/post?u=abc123&id=def456"

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Set the current year in the footer.
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /**
   * Load a JSONP URL by injecting a <script> tag and waiting for Mailchimp
   * to call back our uniquely-named global function. This is how a static
   * page talks to Mailchimp without a server or CORS headers.
   */
  function jsonp(url, callback) {
    var name = "wwd_cb_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);
    var script = document.createElement("script");

    var timer = setTimeout(function () {
      cleanup();
      callback(new Error("Request timed out. Please try again."));
    }, 12000);

    function cleanup() {
      clearTimeout(timer);
      try { delete window[name]; } catch (e) { window[name] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[name] = function (data) {
      cleanup();
      callback(null, data);
    };
    script.onerror = function () {
      cleanup();
      callback(new Error("Network error. Please try again."));
    };

    script.src = url + (url.indexOf("?") >= 0 ? "&" : "?") + "c=" + name;
    document.body.appendChild(script);
  }

  function stripHtml(s) {
    var d = document.createElement("div");
    d.innerHTML = String(s || "");
    return (d.textContent || d.innerText || "").trim();
  }

  /**
   * Send the captured lead to Mailchimp (or to localStorage while unconfigured).
   * Resolves on success; rejects with a human-readable Error otherwise.
   */
  function submitLead(email) {
    // Fallback for setup: keep leads locally so none are lost before Mailchimp is wired.
    if (!MAILCHIMP_URL) {
      try {
        var key = "wwd_leads";
        var leads = JSON.parse(localStorage.getItem(key) || "[]");
        leads.push({ email: email, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(leads));
      } catch (e) { /* private mode — ignore */ }
      return Promise.resolve();
    }

    // Turn the embedded-form URL into the JSONP endpoint and add the email.
    var base = MAILCHIMP_URL
      .replace(/&amp;/g, "&")           // in case it was copied from HTML
      .replace("/post?", "/post-json?");
    var url = base + "&EMAIL=" + encodeURIComponent(email);

    return new Promise(function (resolve, reject) {
      jsonp(url, function (err, data) {
        if (err) return reject(err);
        if (data && data.result === "success") return resolve();
        var msg = stripHtml(data && data.msg) || "Subscription failed. Please try again.";
        // "Already subscribed" isn't a real failure — treat it as success.
        if (/already subscribed/i.test(msg)) return resolve();
        reject(new Error(msg));
      });
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

      submitLead(email).then(function () {
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
