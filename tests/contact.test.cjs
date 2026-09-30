const { test } = require('node:test');
const assert = require('node:assert/strict');
const { contact, escapeHtml } = require('../backend/contact.cjs');
const body = { name: '<script>test</script>', email: 'test@example.com', budget: 'Not sure yet', timeline: 'Flexible', serviceRequired: ['React Development'], projectDetails: 'A project with sufficient detail for validation.' };
function response() { return { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } }; }
test('contact delivery and validation', async t => {
  const oldFetch = global.fetch;
  const oldKey = process.env.RESEND_API_KEY;
  const oldSecret = process.env.TURNSTILE_SECRET_KEY;
  delete process.env.TURNSTILE_SECRET_KEY;
  try {
    await t.test('rejects unsupported methods', async () => { const res = response(); await contact({ method: 'GET' }, res); assert.equal(res.code, 405); assert.equal(res.headers.Allow, 'POST'); });
    await t.test('rejects invalid payloads', async () => { for (const input of [null, [], {}, { ...body, name: ' ' }, { ...body, serviceRequired: [null] }, { ...body, projectDetails: 'short' }]) { const res = response(); await contact({ method: 'POST', body: input }, res); assert.equal(res.code, 400); } });
    await t.test('discards honeypot submissions without email', async () => { global.fetch = () => { throw new Error('must not send'); }; const res = response(); await contact({ method: 'POST', body: { honeypot: 'bot' } }, res); assert.equal(res.code, 200); });
    await t.test('does not fake success without credentials', async () => { delete process.env.RESEND_API_KEY; const res = response(); await contact({ method: 'POST', body }, res); assert.equal(res.code, 503); assert.notEqual(res.body.success, true); });
    process.env.RESEND_API_KEY = 'test-only';
    await t.test('escapes HTML and delivers the inquiry', async () => { const sent = []; global.fetch = async (url, options) => { sent.push(JSON.parse(options.body)); return { ok: true }; }; const res = response(); await contact({ method: 'POST', body }, res); assert.equal(res.code, 200); assert.equal(sent.length, 2); assert.ok(sent[0].html.includes('&lt;script&gt;')); assert.ok(!sent[0].html.includes('<script>')); assert.equal(sent[0].reply_to, body.email); });
    await t.test('reports failed inquiry delivery', async () => { global.fetch = async () => ({ ok: false, status: 401 }); const res = response(); await contact({ method: 'POST', body }, res); assert.equal(res.code, 502); assert.notEqual(res.body.success, true); });
    await t.test('confirmation failure does not duplicate delivered inquiries', async () => { let count = 0; global.fetch = async () => ({ ok: ++count === 1, status: 502 }); const res = response(); await contact({ method: 'POST', body }, res); assert.equal(res.code, 200); assert.equal(res.body.success, true); });
    await t.test('requires verification when Turnstile is configured', async () => { process.env.TURNSTILE_SECRET_KEY = 'test-only'; const res = response(); await contact({ method: 'POST', body }, res); assert.equal(res.code, 400); });
    assert.equal(escapeHtml('a&<b>"'), 'a&amp;&lt;b&gt;&quot;');
  } finally { global.fetch = oldFetch; if (oldKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = oldKey; if (oldSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY; else process.env.TURNSTILE_SECRET_KEY = oldSecret; }
});
