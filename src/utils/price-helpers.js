/**
 * Formats the price with commas for every thousand
 * and exactly two decimal places.
 * @param {number|string} price - The price to format.
 * @returns {string} - The formatted price, e.g. "1,23,456.00"
 */
const formatPrice = (price) => {
  // coerce to number (handles strings, null, undefined)
  const num = parseFloat(price) || 0;
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export { formatPrice };
