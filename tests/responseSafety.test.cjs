const { test } = require('node:test');
const assert = require('node:assert/strict');
const { sanitize } = require('../backend/responseSafety.cjs');
test('removes credential hashes from nested API responses without changing dates', () => {
  const date = new Date('2026-09-30');
  const input = { user: { name: 'Intern', passwordHash: 'secret' }, interns: [{ passwordHash: 'other', id: 1 }], date };
  assert.deepEqual(sanitize(input), { user: { name: 'Intern' }, interns: [{ id: 1 }], date });
  assert.equal(input.user.passwordHash, 'secret');
});
