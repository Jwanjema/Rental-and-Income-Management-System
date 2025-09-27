// client/api.js

// API_BASE_URL will be the Render URL from Vercel/Netlify environment variables (e.g., VITE_APP_API_URL).
// It must be set as the full Render URL WITHOUT a trailing slash (e.g., 'https://rentaldb-ordc.onrender.com').
const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '';

async function handleApiCall(url, method, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
    credentials: 'include',
  };

  let apiUrl;

  // Ensure the endpoint path does not start with a slash when concatenating
  // with the full BASE_URL to prevent the double slash (//) error.
  const cleanUrl = url.startsWith('/') ? url.substring(1) : url;

  if (API_BASE_URL) {
    // PRODUCTION (Vercel): Use the full Render URL and the cleaned path.
    // Result: https://rentaldb-ordc.onrender.com/dashboard_summary
    apiUrl = `${API_BASE_URL}/${cleanUrl}`;
  } else {
    // DEVELOPMENT (Local): Use the '/api' prefix to trigger the Vite proxy
    // Result: /api/dashboard_summary
    apiUrl = `/api${url}`;
  }

  const response = await fetch(apiUrl, options);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Allow UserContext to handle 401 on startup, but force redirect for other calls
      if (url !== '/check_session') {
        window.location.href = '/login'; 
      }
    }
    const errorData = await response.json().catch(() => ({ error: `Request failed with status ${response.status}` })); 
    throw new Error(errorData.error || `Failed to perform ${method} on ${url}`);
  }
  
  // The 204 status code is used for successful deletion (No Content)
  return response.status === 204 ? null : response.json();
}

// --- Auth Routes ---
export const checkSession = () => handleApiCall(`/check_session`, 'GET');

// --- Dashboard & Reports ---
export const getDashboardSummary = () => handleApiCall(`/dashboard_summary`, 'GET');
// Note: This report path should be updated to match the one used in Reports.jsx: /reports/property_financials
export const getFinancialReport = (propertyId, year) => handleApiCall(`/reports/property_financials?property_id=${propertyId}&year=${year}`, 'GET');

// --- Profile ---
export const updateProfile = (profileData) => handleApiCall('/profile', 'PATCH', profileData);

// --- Generic CRUD Functions ---
const createApiResource = (resource) => ({
  getAll: () => handleApiCall(`/${resource}`, 'GET'),
  add: (newItem) => handleApiCall(`/${resource}`, 'POST', newItem),
  update: (id, updatedItem) => handleApiCall(`/${resource}/${id}`, 'PATCH', updatedItem),
  delete: (id) => handleApiCall(`/${resource}/${id}`, 'DELETE'),
});

export const propertiesApi = createApiResource('properties');
export const unitsApi = createApiResource('units');
export const tenantsApi = createApiResource('tenants');
export const leasesApi = createApiResource('leases');
export const paymentsApi = createApiResource('payments');
export const expensesApi = createApiResource('expenses');