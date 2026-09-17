const BASE_URL = ""; // Relative path allows Vite proxy in dev & same origin in production

export async function apiClient(endpoint, options = {}) {
  const { body, headers, ...customConfig } = options;

  const config = {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.details || errorMessage;
    } catch {
      // Fall back to default status text
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  // Check if response has content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return await response.text();
}

export const api = {
  get: (endpoint, options) => apiClient(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) => apiClient(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options) => apiClient(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options) => apiClient(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options) => apiClient(endpoint, { ...options, method: "DELETE" }),
};

export default api;
