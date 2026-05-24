/**
 * Helper functions for BFHL Backend
 */

/**
 * Checks if a string represents a prime number.
 * A prime number is an integer greater than 1 that has no positive divisors other than 1 and itself.
 * @param {string|number} val 
 * @returns {boolean}
 */
function isPrime(val) {
  const num = Number(val);
  if (isNaN(num) || !Number.isInteger(num) || num <= 1) {
    return false;
  }
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

/**
 * Filters the input array to find lowercase single character alphabets
 * and returns the highest one in alphabetical order.
 * @param {string[]} arr 
 * @returns {string[]} An array containing the highest lowercase alphabet, or empty array if none.
 */
function getHighestLowercase(arr) {
  if (!Array.isArray(arr)) return [];
  
  const lowercaseAlphabets = arr.filter(
    item => typeof item === 'string' && item.length === 1 && /^[a-z]$/.test(item)
  );

  if (lowercaseAlphabets.length === 0) {
    return [];
  }

  // Sort alphabetically descending and get the first one
  lowercaseAlphabets.sort((a, b) => b.localeCompare(a));
  return [lowercaseAlphabets[0]];
}

/**
 * Validates a base64 string and extracts file metadata (MIME type and size in KB).
 * Supports both Data URL format (data:image/png;base64,...) and raw base64 format.
 * @param {string} b64Str 
 * @returns {object} { file_valid, file_mime_type, file_size_kb }
 */
function validateAndParseBase64File(b64Str) {
  if (!b64Str || typeof b64Str !== 'string' || b64Str.trim() === '') {
    return {
      file_valid: false,
      file_mime_type: null,
      file_size_kb: null
    };
  }

  try {
    let mimeType = null;
    let base64Data = b64Str;

    // Check if it's a data URI
    const dataUriMatch = b64Str.match(/^data:([^;]+);base64,(.*)$/);
    if (dataUriMatch) {
      mimeType = dataUriMatch[1];
      base64Data = dataUriMatch[2];
    }

    // Validate if it is correct base64
    // Standard base64 regex check
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    const cleanBase64 = base64Data.replace(/\s/g, ''); // strip any whitespaces

    if (!base64Regex.test(cleanBase64) || cleanBase64.length % 4 !== 0) {
      return {
        file_valid: false,
        file_mime_type: null,
        file_size_kb: null
      };
    }

    // Decode base64 to check validity and get buffer
    const buffer = Buffer.from(cleanBase64, 'base64');
    if (buffer.length === 0) {
      return {
        file_valid: false,
        file_mime_type: null,
        file_size_kb: null
      };
    }

    // If MIME type wasn't in Data URL, try to guess from buffer magic numbers
    if (!mimeType) {
      const hex = buffer.toString('hex', 0, 4).toUpperCase();
      if (hex.startsWith('89504E47')) {
        mimeType = 'image/png';
      } else if (hex.startsWith('FFD8FF')) {
        mimeType = 'image/jpeg';
      } else if (hex.startsWith('47494638')) {
        mimeType = 'image/gif';
      } else if (hex.startsWith('25504446')) {
        mimeType = 'application/pdf';
      } else {
        mimeType = 'application/octet-stream'; // Fallback
      }
    }

    // Calculate file size in KB
    // (base64 string length * 3) / 4 to get bytes
    const sizeInBytes = buffer.length;
    const sizeInKb = (sizeInBytes / 1024).toFixed(2);

    return {
      file_valid: true,
      file_mime_type: mimeType,
      file_size_kb: parseFloat(sizeInKb)
    };
  } catch (error) {
    return {
      file_valid: false,
      file_mime_type: null,
      file_size_kb: null
    };
  }
}

module.exports = {
  isPrime,
  getHighestLowercase,
  validateAndParseBase64File
};
