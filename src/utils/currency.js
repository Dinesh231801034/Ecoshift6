// Currency formatting utilities

/**
 * Format a number as Indian Rupees (₹)
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: true)
 * @returns {string} Formatted currency string
 */
export const formatRupees = (amount, showDecimals = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const numAmount = parseFloat(amount);
  
  if (showDecimals) {
    return `₹${numAmount.toFixed(2)}`;
  } else {
    return `₹${Math.round(numAmount)}`;
  }
};

/**
 * Format a number as Indian Rupees with thousand separators
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: true)
 * @returns {string} Formatted currency string with commas
 */
export const formatRupeesWithCommas = (amount, showDecimals = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const numAmount = parseFloat(amount);
  
  if (showDecimals) {
    return `₹${numAmount.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  } else {
    return `₹${numAmount.toLocaleString('en-IN', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    })}`;
  }
};

/**
 * Convert USD to INR (approximate rate)
 * @param {number} usdAmount - Amount in USD
 * @param {number} exchangeRate - Exchange rate (default: 83.5)
 * @returns {number} Amount in INR
 */
export const convertUsdToInr = (usdAmount, exchangeRate = 83.5) => {
  if (usdAmount === null || usdAmount === undefined || isNaN(usdAmount)) {
    return 0;
  }
  return parseFloat(usdAmount) * exchangeRate;
};

/**
 * Format USD amount as INR
 * @param {number} usdAmount - Amount in USD
 * @param {number} exchangeRate - Exchange rate (default: 83.5)
 * @param {boolean} showDecimals - Whether to show decimal places (default: true)
 * @returns {string} Formatted INR string
 */
export const formatUsdAsInr = (usdAmount, exchangeRate = 83.5, showDecimals = true) => {
  const inrAmount = convertUsdToInr(usdAmount, exchangeRate);
  return formatRupeesWithCommas(inrAmount, showDecimals);
};
