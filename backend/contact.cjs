// Shared by the Express backend and Vercel function.
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

async function contact(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const data = req.body;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return res.status(400).json({ error: 'Invalid request body' });
  if (typeof data.honeypot === 'string' && data.honeypot) return res.status(200).json({ success: true });
  const validText = (key, min, max) => typeof data[key] === 'string' && data[key].trim().length >= min && data[key].length <= max;
  if (!validText('name', 2, 80) || !validText('email', 3, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
      !validText('projectDetails', 20, 2000) || !validText('budget', 1, 100) || !validText('timeline', 1, 100) ||
      (data.company !== undefined && (typeof data.company !== 'string' || data.company.length > 100)) ||
      !Array.isArray(data.serviceRequired) || data.serviceRequired.length < 1 || data.serviceRequired.length > 6 ||
      data.serviceRequired.some(service => typeof service !== 'string' || service.length > 100)) {
    return res.status(400).json({ error: 'Please provide valid contact details, budget, timeline, services, and project details.' });
  }
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: 'Email delivery is unavailable. Please email hello@taksha.studio directly.' });
  try {
    if (process.env.TURNSTILE_SECRET_KEY) {
      if (typeof data.token !== 'string' || !data.token) return res.status(400).json({ error: 'Bot verification required' });
      const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST', body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: data.token }), signal: AbortSignal.timeout(10000)
      });
      const result = await verification.json();
      if (!verification.ok || !result.success) return res.status(400).json({ error: 'Bot verification failed' });
    }
    const send = async (payload) => {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error('Email delivery failed (' + response.status + ')');
    };
    const from = process.env.CONTACT_FROM_EMAIL || 'Taksha Website <website@taksha.studio>';
    await send({ from, to: process.env.INTERNAL_NOTIFICATION_EMAIL || 'hello@taksha.studio', reply_to: data.email,
      subject: 'New Lead: ' + data.name.replace(/[\r\n]/g, ' ') + ' - ' + data.budget,
      html: '<h2>New Project Inquiry</h2>' + ['name', 'email', 'company', 'budget', 'timeline'].map(key => '<p><strong>' + key + ':</strong> ' + escapeHtml(data[key] || 'N/A') + '</p>').join('') +
        '<p><strong>Services:</strong> ' + data.serviceRequired.map(escapeHtml).join(', ') + '</p><h3>Project Details</h3><p>' + escapeHtml(data.projectDetails).replace(/\n/g, '<br/>') + '</p>'
    });
    // The inquiry is delivered even if the optional confirmation email fails.
    try {
      await send({ from, to: data.email, subject: "We've received your inquiry. Let's talk.",
        html: '<p>Hello ' + escapeHtml(data.name) + ',</p><p>Thank you for reaching out to Taksha. We have received your project details and will respond within 1–2 business days.</p><p>The Taksha Team</p>' });
    } catch (error) { console.warn('Contact confirmation email failed:', error.message); }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact delivery failed:', error.message);
    return res.status(502).json({ error: 'Unable to send your inquiry. Please try again or email hello@taksha.studio.' });
  }
}
module.exports = { contact, escapeHtml };
