// Get the backend URL from the environment variable set on OnRender.
// For local development, this will be an empty string, and the Vite proxy will be used.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// A centralized function to handle all API calls.
async function handleApiCall(url, method, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
    credentials: 'include', // Essential for sending session cookies
  };

  // Prepend the base URL to the request path
  const response = await fetch(`${API_BASE_URL}${url}`, options);
  
  if (!response.ok) {
    if (response.status === 401) {
      // If unauthorized, the session is likely expired. Force a reload to the login page.
      window.location.href = '/login'; 
    }
    
    // Try to parse the error message from the backend, otherwise throw a generic error.
    try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    } catch (e) {
        // This catches the "Unexpected end of JSON input" error if the response body is not valid JSON
        throw new Error(`Request failed with status ${response.status} and response was not valid JSON.`);
    }
  }
  
  // Handle responses with no content (like DELETE requests)
  return response.status === 204 ? null : response.json();
}

// --- Specific API Functions ---
export const getDashboardSummary = () => handleApiCall(`/api/dashboard_summary`, 'GET');
export const getFinancialReport = (propertyId, year) => handleApiCall(`/api/reports/property_financials?property_id=${propertyId}&year=${year}`, 'GET');
export const updateProfile = (profileData) => handleApiCall('/api/profile', 'PATCH', profileData);

// --- A "factory" to create a standard set of CRUD functions for a resource ---
const createApiResource = (resource) => ({
  // THE FIX IS HERE: The path now correctly includes the /api prefix.
  getAll: () => handleApiCall(`/api/${resource}`, 'GET'),
  add: (newItem) => handleApiCall(`/api/${resource}`, 'POST', newItem),
  update: (id, updatedItem) => handleApiCall(`/api/${resource}/${id}`, 'PATCH', updatedItem),
  delete: (id) => handleApiCall(`/api/${resource}/${id}`, 'DELETE'),
});

// --- Exported Resource Objects ---
export const propertiesApi = createApiResource('properties');
export const unitsApi = createApiResource('units');
export const tenantsApi = createApiResource('tenants');
export const leasesApi = createApiResource('leases');
export const paymentsApi = createApiResource('payments');
export const expensesApi = createApiResource('expenses');