const { test } = require('node:test');
const assert = require('node:assert/strict');
const routes = new Map();
const app = Object.fromEntries(['get', 'put', 'post'].map(method => [method, (path, auth, handler) => routes.set(method + ' ' + path, handler)]));
let user = { id: 'intern', passwordHash: 'hash', preferences: {} }, records = [], update;
const prisma = { systemLog: { findMany: async arg => { update = arg; return []; } }, user: { findUnique: async () => user, update: async arg => { update = arg; return { preferences: arg.data.preferences }; } }, leaveRequest: { findMany: async arg => { update = arg; return records; }, create: async arg => { update = arg; return { id: 'leave', ...arg.data, status: 'PENDING' }; }, findUnique: async () => ({ id: 'leave', intern: { mentorId: 'mentor' } }), update: async arg => arg.data } };
require('../backend/portalRoutes.cjs')(app, prisma, () => {}, { compare: async password => password === 'correct', hash: async () => 'new-hash' });
const response = () => ({ code: 200, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } });
async function invoke(route, body = {}, role = 'INTERN', id = 'intern') { const res = response(); await routes.get(route)({ body, user: { id, role }, params: { id: 'leave' } }, res); return res; }
test('portal validation, persistence, and ownership', async t => {
  await t.test('activity is restricted to administrators', async () => assert.equal((await invoke('get /api/reports/activity')).code, 403));
  await t.test('administrators can load real activity', async () => { const res = await invoke('get /api/reports/activity', {}, 'SUPER_ADMIN'); assert.equal(res.code, 200); assert.equal(update.take, 10); });
  await t.test('requires typed preferences', async () => assert.equal((await invoke('put /api/users/preferences', { emailNotifications: 'yes' })).code, 400));
  await t.test('persists preferences for current user', async () => { const res = await invoke('put /api/users/preferences', { emailNotifications: false, taskNotifications: true }); assert.equal(res.code, 200); assert.equal(update.where.id, 'intern'); assert.equal(res.body.emailNotifications, false); });
  await t.test('rejects short passwords and incorrect current password', async () => { assert.equal((await invoke('post /api/auth/update-password', { currentPassword: 'correct', newPassword: 'short' })).code, 400); assert.equal((await invoke('post /api/auth/update-password', { currentPassword: 'wrong', newPassword: 'new-password' })).code, 400); });
  await t.test('updates password only after verification', async () => { const res = await invoke('post /api/auth/update-password', { currentPassword: 'correct', newPassword: 'new-password' }); assert.equal(res.body.success, true); assert.equal(update.data.passwordHash, 'new-hash'); });
  const valid = { type: 'Sick Leave', from: '2026-10-01', to: '2026-10-02', reason: 'Time off' };
  await t.test('rejects reversed and invalid calendar dates', async () => { for (const body of [{ ...valid, from: '2026-10-03' }, { ...valid, from: '2026-02-30' }, { ...valid, reason: '' }]) assert.equal((await invoke('post /api/leaves', body)).code, 400); });
  await t.test('creates pending leave for authenticated intern', async () => { const res = await invoke('post /api/leaves', { ...valid, internId: 'someone-else' }); assert.equal(res.code, 201); assert.equal(res.body.internId, 'intern'); assert.equal(res.body.days, 2); assert.equal(res.body.status, 'PENDING'); });
  await t.test('mentors cannot create intern leave', async () => assert.equal((await invoke('post /api/leaves', valid, 'MENTOR')).code, 403));
  await t.test('intern history is scoped to their account', async () => { await invoke('get /api/leaves'); assert.deepEqual(update.where, { internId: 'intern' }); });
  await t.test('mentor history is scoped to assigned interns', async () => { await invoke('get /api/leaves', {}, 'MENTOR', 'mentor'); assert.deepEqual(update.where, { intern: { mentorId: 'mentor' } }); });
  await t.test('interns cannot approve leave', async () => assert.equal((await invoke('put /api/leaves/:id/status', { status: 'APPROVED' })).code, 403));
  await t.test('other mentors cannot approve leave', async () => assert.equal((await invoke('put /api/leaves/:id/status', { status: 'APPROVED' }, 'MENTOR', 'other')).code, 403));
  await t.test('assigned mentor can approve leave', async () => { const res = await invoke('put /api/leaves/:id/status', { status: 'APPROVED' }, 'MENTOR', 'mentor'); assert.equal(res.code, 200); assert.equal(res.body.status, 'APPROVED'); });
});
