function sanitize(value) {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object' && !(value instanceof Date) && !Buffer.isBuffer(value)) return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'passwordHash').map(([key, item]) => [key, sanitize(item)]));
  return value;
}
module.exports = { sanitize };
