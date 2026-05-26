// Configures the backend base API path
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://bajaj-finserv-health-bfhl-1.onrender.com'
    : 'http://localhost:5000/api/tickets');

export default API_BASE_URL;
