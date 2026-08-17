const CRM_ENDPOINT = 'https://thequotemasters.com/crm_api/api.php?action=push_lead';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidZip(value) {
  return /^\d{5}(-\d{4})?$/.test(value);
}

function sanitizeText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://medicalofficecleaninghoulton.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.CRM_API_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'Server misconfiguration' });
    return;
  }

  const body = req.body || {};

  const name = sanitizeText(body.name, 120);
  const phoneDigits = sanitizeText(body.phone, 20).replace(/[^\d]/g, '');
  const zip = sanitizeText(body.zip, 10);
  const email = sanitizeText(body.email, 254);

  if (!name || phoneDigits.length < 10 || !isValidZip(zip)) {
    res.status(400).json({ error: 'Missing or invalid required fields' });
    return;
  }
  if (email && !isValidEmail(email)) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  const nameParts = name.split(/\s+/);
  const firstName = nameParts.shift() || name;
  const lastName = nameParts.join(' ');

  const notesParts = [];
  const facility = sanitizeText(body.facility, 200);
  const type = sanitizeText(body.type, 60);
  const sqft = sanitizeText(body.sqft, 40);
  if (type) notesParts.push(`Facility type: ${type}`);
  if (sqft) notesParts.push(`Approx. sq ft: ${sqft}`);
  const message = sanitizeText(body.message, 1000);
  if (message) notesParts.push(message);

  const payload = {
    zip,
    customer: {
      company_name: facility,
      first_name: firstName,
      last_name: lastName,
      position: '',
      phone: phoneDigits,
      email,
      email2: '',
      address: '',
      service_address: '',
      notes: notesParts.join(' | ')
    },
    number_of_quotes: '1',
    utm_source: sanitizeText(body.utm_source, 255)
  };

  try {
    const crmResponse = await fetch(CRM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const text = await crmResponse.text();

    if (!crmResponse.ok) {
      res.status(502).json({ error: 'CRM submission failed' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(502).json({ error: 'CRM submission failed' });
  }
};
