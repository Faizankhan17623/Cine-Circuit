// Turns user input into a literal, length-capped regex source so it cannot inject patterns or cause ReDoS
const escapeRegex = (value, max = 100) => String(value ?? '').trim().slice(0, max).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = escapeRegex;
