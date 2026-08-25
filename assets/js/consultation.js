(() => {
  "use strict";
  const cfg = window.BHI_CONFIG || {};
  const form = document.getElementById("consultation-form");
  if (!form) return;

  const submitButton = document.getElementById("consultation-submit");
  const message = document.getElementById("consultation-message");
  const startedAt = document.getElementById("form-started-at");
  startedAt.value = String(Date.now());

  const clean = (value) => String(value || "").trim();
  const selected = (name) => Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);

  function setMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error-message", isError);
    message.classList.toggle("success-message", !isError && Boolean(text));
  }

  function validate() {
    const firstName = clean(document.getElementById("first-name").value);
    const lastName = clean(document.getElementById("last-name").value);
    const email = clean(document.getElementById("email").value);
    const phone = clean(document.getElementById("phone").value);
    const contactMethod = clean(document.getElementById("contact-method").value);
    const insuranceProvider = clean(document.getElementById("insurance-provider").value);
    const days = selected("days");
    const times = selected("times");
    const consent = document.getElementById("request-consent").checked;

    if (!firstName || !lastName || !email || !phone || !contactMethod || !insuranceProvider) throw new Error("Please complete all required fields.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email address.");
    if (days.length === 0) throw new Error("Please select at least one generally available day.");
    if (times.length === 0) throw new Error("Please select at least one general time of day.");
    if (!consent) throw new Error("Please acknowledge that this is only a consultation request.");

    return { firstName, lastName, email, phone, contactMethod, insuranceProvider, days, times,
      website: clean(document.getElementById("website").value), formStartedAt: clean(startedAt.value) };
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      if (!cfg.CONSULTATION_API_URL || !String(cfg.CONSULTATION_API_URL).startsWith("https://script.google.com/")) {
        throw new Error("The consultation request system is not configured yet.");
      }
      const payload = validate();
      submitButton.disabled = true;
      submitButton.textContent = "Submitting…";

      const response = await fetch(cfg.CONSULTATION_API_URL, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "submitConsultationRequest", request: payload })
      });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || "The request could not be submitted.");

      form.reset();
      startedAt.value = String(Date.now());
      setMessage("Your consultation request has been received. Brave Horizon Institute will contact you regarding availability.");
    } catch (error) {
      setMessage(error?.message || "The request could not be submitted. Please try again later.", true);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Consultation Request";
    }
  });
})();
