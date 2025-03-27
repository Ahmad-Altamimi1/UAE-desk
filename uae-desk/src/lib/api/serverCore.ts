import endPoints from "./endpoints/dashboard";

async function getValidApiUrl(
  endpoint: keyof typeof endPoints
): Promise<string> {
  let baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  let endpointPath = endPoints[endpoint]?.trim();

  if (!baseUrl) throw new Error("API base URL is not defined");
  if (!endpointPath) throw new Error(`Endpoint "${endpoint}" is not defined`);

  if (!/^https?:\/\//.test(baseUrl)) {
    console.warn(`Invalid baseUrl: ${baseUrl}. Prepending "http://".`);
    baseUrl = `http://${baseUrl}`;
  }

  baseUrl = baseUrl.replace(/\/$/, "");
  endpointPath = endpointPath.replace(/^\//, "");
  return `${baseUrl}/${endpointPath}`;
}

// 1️⃣ Fetch CSRF token before making requests
async function getCsrfToken(): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!baseUrl) throw new Error("API base URL is not defined");

  const csrfUrl = `${baseUrl}/sanctum/csrf-cookie`;

  console.log("Fetching CSRF Token:", csrfUrl);

  await fetch(csrfUrl, {
    method: "GET",
    credentials: "include", // Ensure cookies are stored
  });
}

// 2️⃣ General GET request function
export async function fetchApi<TResponse>(
  endpoint: keyof typeof endPoints,
  options: RequestInit = {}
): Promise<TResponse> {
  await getCsrfToken(); // Ensure CSRF token is set before API request

  const url = await getValidApiUrl(endpoint);
  console.log("GET Request URL:", url);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include", // Important for Sanctum
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    } catch {
      throw new Error(`API error: ${response.statusText}`);
    }
  }

  return response.json();
}

// 3️⃣ POST, PUT, DELETE requests with CSRF handling
export async function fetchCUDApi<TResponse, TRequest>(
  endpoint: keyof typeof endPoints,
  method: "POST" | "PUT" | "DELETE",
  body?: TRequest,
  options: RequestInit = {}
): Promise<TResponse> {
  await getCsrfToken();

  const url = await getValidApiUrl(endpoint);
  console.log("CUDA Request:", { method, url, body });

  const response = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  console.log("Response Status:", response.status);

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.statusText}`);
    } catch {
      throw new Error(`API error: ${response.statusText}`);
    }
  }

  return response.json();
}
