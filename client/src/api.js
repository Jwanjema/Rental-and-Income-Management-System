const API_BASE_URL = '/api'; // Use the proxy

async function handleApiCall(url, method, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
    credentials: 'include',
  };

  const response = await fetch(`${API_BASE_URL}${url}`, options);
  
  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = '/login'; // Force redirect if unauthorized
    }
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to perform ${method} on ${url}`);
  }
  
  return response.status === 204 ? null : response.json();
}

// --- Dashboard & Reports ---
export const getDashboardSummary = () => handleApiCall(`/dashboard_summary`, 'GET');
export const getFinancialReport = (startDate, endDate) => handleApiCall(`/reports/financial_summary_by_date?start_date=${startDate}&end_date=${endDate}`, 'GET');

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
export const expensesApi = createApiResource('expenses'); // <-- THIS IS THE NEWLY ADDED LINE