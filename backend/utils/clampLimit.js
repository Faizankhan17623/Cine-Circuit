// Page size from the query string, kept between 1 and max so one request cannot load a whole collection
const clampLimit = (value, fallback = 20, max = 100) => Math.min(Math.max(parseInt(value) || fallback, 1), max);

module.exports = clampLimit;
