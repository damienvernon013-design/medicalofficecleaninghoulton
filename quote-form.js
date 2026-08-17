(function () {
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var STORAGE_KEY = 'qm_utm_params';

  function captureUtm() {
    var params = new URLSearchParams(window.location.search);
    var found = {};
    var hasAny = false;
    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        found[key] = value;
        hasAny = true;
      }
    });
    if (hasAny) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      } catch (e) {}
    }
  }

  function getStoredUtm() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function buildUtmSource() {
    var stored = getStoredUtm();
    if (stored.utm_source) return stored.utm_source;
    if (document.referrer) {
      try {
        return new URL(document.referrer).hostname;
      } catch (e) {}
    }
    return 'direct';
  }

  captureUtm();

  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form[data-quote-form]');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        submitForm(form);
      });
    });
  });

  function submitForm(form) {
    var submitButton = form.querySelector('button[type="submit"]');
    var statusEl = form.querySelector('.form-status');
    var formData = new FormData(form);
    var payload = {};
    formData.forEach(function (value, key) {
      payload[key] = value;
    });
    payload.utm_source = buildUtmSource();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting…';
    }
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'form-status';
    }

    fetch('/api/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok) {
          form.reset();
          if (statusEl) {
            statusEl.textContent = 'Thank you — your request has been received. We will respond by next business day.';
            statusEl.className = 'form-status form-status-success';
          }
        } else {
          throw new Error(result.data && result.data.error ? result.data.error : 'Submission failed');
        }
      })
      .catch(function () {
        if (statusEl) {
          statusEl.textContent = 'We could not submit your request online. Please call (866) 958-8773.';
          statusEl.className = 'form-status form-status-error';
        }
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Request My Free Quote';
        }
      });
  }
})();
