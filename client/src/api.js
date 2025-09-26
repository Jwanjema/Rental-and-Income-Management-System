// This line is the key. It makes the base URL dynamic.
// In production, it will use the URL from your OnRender environment variable.
// In local development, the variable is not set, so it will fall back to an empty string,
// allowing the Vite proxy to work correctly.
const API_BASE_URL = 'https://rental-backend-ir36.onrender.com';

async function handleApiCall(url, method, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
    credentials: 'include', // Essential for sending session cookies
  };

  // The full, correct URL will be constructed here for every request.
  // e.g., "https://rental-backend.onrender.com/api/login" in production
  // or "/api/login" locally.
  const response = await fetch(`${API_BASE_URL}${url}`, options);
  
  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = '/login'; // Force redirect if unauthorized
    }
    
    // This robust error handling prevents the JSON parsing error
    try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    } catch (e) {
        throw new Error(`Request failed with status ${response.status}. The server response was not valid JSON.`);
    }
  }
  
  // Handle successful responses that have no content (like DELETE)
  return response.status === 204 ? null : response.json();
}


// --- Auth and Report Routes ---
// Note: We now must include the /api prefix in every call to match the backend.
export const getDashboardSummary = () => handleApiCall(`/api/dashboard_summary`, 'GET');
export const getFinancialReport = (propertyId, year) => handleApiCall(`/api/reports/property_financials?property_id=${propertyId}&year=${year}`, 'GET');
export const updateProfile = (profileData) => handleApiCall('/api/profile', 'PATCH', profileData);

// --- A "factory" to create a standard set of CRUD functions for a resource ---
const createApiResource = (resource) => ({
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