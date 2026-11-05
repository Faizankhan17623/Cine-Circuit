// Escapes a value for use inside HTML text or a quoted attribute; null/undefined become ''
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

module.exports = escapeHtml;
