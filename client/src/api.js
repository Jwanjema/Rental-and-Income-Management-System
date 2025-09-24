const API_BASE_URL = 'http://127.0.0.1:5000';

// --- General Functions ---
async function handleApiCall(url, method, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to perform ${method} on ${url}`);
  }
  
  if (response.status === 204) {
    return null; // Handle successful deletion
  }

  return response.json();
}

// --- Dashboard Functions ---
export const getDashboardSummary = async () => handleApiCall(`${API_BASE_URL}/dashboard_summary`, 'GET');

// --- Property Functions ---
export const getProperties = async () => handleApiCall(`${API_BASE_URL}/properties`, 'GET');
export const addProperty = async (newProperty) => handleApiCall(`${API_BASE_URL}/properties`, 'POST', newProperty);
export const updateProperty = async (id, updatedProperty) => handleApiCall(`${API_BASE_URL}/properties/${id}`, 'PATCH', updatedProperty);
export const deleteProperty = async (id) => handleApiCall(`${API_BASE_URL}/properties/${id}`, 'DELETE');

// --- Unit Functions ---
export const getUnits = async () => handleApiCall(`${API_BASE_URL}/units`, 'GET');
export const addUnit = async (newUnit) => handleApiCall(`${API_BASE_URL}/units`, 'POST', newUnit);
export const updateUnit = async (id, updatedUnit) => handleApiCall(`${API_BASE_URL}/units/${id}`, 'PATCH', updatedUnit);
export const deleteUnit = async (id) => handleApiCall(`${API_BASE_URL}/units/${id}`, 'DELETE');

// --- Tenant Functions ---
export const getTenants = async () => handleApiCall(`${API_BASE_URL}/tenants`, 'GET');
export const addTenant = async (newTenant) => handleApiCall(`${API_BASE_URL}/tenants`, 'POST', newTenant);
export const updateTenant = async (id, updatedTenant) => handleApiCall(`${API_BASE_URL}/tenants/${id}`, 'PATCH', updatedTenant);
export const deleteTenant = async (id) => handleApiCall(`${API_BASE_URL}/tenants/${id}`, 'DELETE');

// --- Lease Functions ---
export const getLeases = async () => handleApiCall(`${API_BASE_URL}/leases`, 'GET');
export const addLease = async (newLease) => handleApiCall(`${API_BASE_URL}/leases`, 'POST', newLease);
export const updateLease = async (id, updatedLease) => handleApiCall(`${API_BASE_URL}/leases/${id}`, 'PATCH', updatedLease);
export const deleteLease = async (id) => handleApiCall(`${API_BASE_URL}/leases/${id}`, 'DELETE');

// --- Payment Functions ---
export const getPayments = async () => handleApiCall(`${API_BASE_URL}/payments`, 'GET');
export const addPayment = async (newPayment) => handleApiCall(`${API_BASE_URL}/payments`, 'POST', newPayment);
export const updatePayment = async (id, updatedPayment) => handleApiCall(`${API_BASE_URL}/payments/${id}`, 'PATCH', updatedPayment);
export const deletePayment = async (id) => handleApiCall(`${API_BASE_URL}/payments/${id}`, 'DELETE');