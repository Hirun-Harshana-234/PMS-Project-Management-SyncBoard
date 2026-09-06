const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isValidId(value) { return typeof value === "string" && idPattern.test(value); }
module.exports = { isValidId };
