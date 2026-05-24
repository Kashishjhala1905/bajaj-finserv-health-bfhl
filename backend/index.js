const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {
  isPrime,
  getHighestLowercase,
  validateAndParseBase64File
} = require('./helpers');

const app = express();

// Increase payload limit for base64 file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS for all requests
app.use(cors());

// Default response variables
const USER_ID = "kashish_jhala_24052026";
const EMAIL = "kashish.jhala.bce21@itbhu.ac.in";
const ROLL_NUMBER = "21BCE10000";

/**
 * @route GET /bfhl
 * @desc Returns operation code
 */
app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});

/**
 * @route POST /bfhl
 * @desc Process input data and return categorized information with file details
 */
app.post('/bfhl', (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    // Validate data field is present and is an array
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: "'data' parameter must be a non-empty array of strings"
      });
    }

    const numbers = [];
    const alphabets = [];

    // Separate numbers and alphabets
    data.forEach(item => {
      const strVal = String(item).trim();
      if (strVal === '') return;

      // Check if it is a number
      if (!isNaN(strVal)) {
        numbers.push(strVal);
      } else if (/^[a-zA-Z]$/.test(strVal)) {
        alphabets.push(strVal);
      }
    });

    // Check if any prime number is present in the numbers array
    const isPrimeFound = numbers.some(numStr => isPrime(numStr));

    // Determine highest lowercase alphabet
    const highestLowercaseAlphabet = getHighestLowercase(alphabets);

    // Validate and parse base64 file details
    const fileDetails = validateAndParseBase64File(file_b64);

    // Construct response
    const responsePayload = {
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercaseAlphabet,
      is_prime_found: isPrimeFound,
      file_valid: fileDetails.file_valid,
      file_mime_type: fileDetails.file_mime_type,
      file_size_kb: fileDetails.file_size_kb
    };

    return res.status(200).json(responsePayload);

  } catch (error) {
    console.error('Error processing POST /bfhl:', error);
    return res.status(500).json({
      is_success: false,
      message: "Internal server error occurred while processing requests"
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BFHL Server is running on port ${PORT}`);
});
