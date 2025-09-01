const Base_Url = import.meta.env.VITE_API_BASE_URL;



export async function Put(endpoint, data, options = {}) {
  const { credentials, ...customHeaders } = options;
  const isFormData = data instanceof FormData;

  const response = await fetch(`${Base_Url}/${endpoint}`, {
    method: "PUT",
    headers: isFormData
      ? customHeaders
      : { "Content-Type": "application/json", ...customHeaders },
    body: isFormData ? data : JSON.stringify(data),
    credentials: credentials || "include",
  });

  if (!response.ok) {
    throw new Error(`PUT ${endpoint} failed: ${response.status}`);
  }

  return response.json();
}

export async function Post(endpoint, data, options = {}) {
  const { credentials, ...customHeaders } = options;
  const isFormData = data instanceof FormData;

  const response = await fetch(`${Base_Url}/${endpoint}`, {
    method: "POST",
    headers: isFormData 
      ? customHeaders 
      : { "Content-Type": "application/json", ...customHeaders },
    body: isFormData ? data : JSON.stringify(data),
    credentials: credentials || "include",
  });

  if (!response.ok) {
    throw new Error(`POST ${endpoint} failed: ${response.status}`);
  }

  return response.json();
}

export async function Get(endpoint, options = {}) {
  const { credentials, ...customHeaders } = options;

  const response = await fetch(`${Base_Url}/${endpoint}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      ...customHeaders 
    },
    credentials: credentials || "include",
  });

  if (!response.ok) {
    throw new Error(`GET ${endpoint} failed: ${response.status}`);
  }

  return response.json();
}

export async function Delete(endpoint, options = {}) {
  const { credentials, ...customHeaders } = options;
  
  const response = await fetch(`${Base_Url}/${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...customHeaders
    },
    credentials: credentials || "include",
  });

  if (!response.ok) {
    throw new Error(`DELETE ${endpoint} failed: ${response.status}`);
  }

  return response.json();
}
