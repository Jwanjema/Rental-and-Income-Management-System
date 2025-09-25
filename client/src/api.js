const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function handleApiCall(url, method, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
    credentials: 'include',
  };
  const response = await fetch(`${API_BASE_URL}${url}`, options);
  if (!response.ok) {
    if (response.status === 401) window.location.href = '/login';
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to perform ${method} on ${url}`);
  }
  return response.status === 204 ? null : response.json();
}

export const getDashboardSummary = () => handleApiCall(`/api/dashboard_summary`, 'GET');
export const getFinancialReport = (propertyId, year) => handleApiCall(`/api/reports/property_financials?property_id=${propertyId}&year=${year}`, 'GET');
export const updateProfile = (profileData) => handleApiCall('/api/profile', 'PATCH', profileData);

const createApiResource = (resource) => ({
  getAll: () => handleApiCall(`/api/${resource}`, 'GET'),
  add: (newItem) => handleApiCall(`/api/${resource}`, 'POST', newItem),
  update: (id, updatedItem) => handleApiCall(`/api/${resource}/${id}`, 'PATCH', updatedItem),
  delete: (id) => handleApiCall(`/api/${resource}/${id}`, 'DELETE'),
});

export const propertiesApi = createApiResource('properties');
export const unitsApi = createApiResource('units');
export const tenantsApi = createApiResource('tenants');
export const leasesApi = createApiResource('leases');
export const paymentsApi = createApiResource('payments');
export const expensesApi = createApiResource('expenses');