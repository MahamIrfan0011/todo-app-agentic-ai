// frontend/src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const api = {
  get: async (path: string, token?: string) => request("GET", path, null, token),
  post: async (path: string, body: any, token?: string) => request("POST", path, body, token),
  put: async (path: string, body: any, token?: string) => request("PUT", path, body, token),
  delete: async (path: string, token?: string) => request("DELETE", path, null, token),
  patch: async (path: string, body: any, token?: string) => request("PATCH", path, body, token),
  postForm: async (path: string, body: any, token?: string) => request("POST", path, body, token, "application/x-www-form-urlencoded"),
};

async function request(method: string, path: string, body: any, token?: string, contentType: string = "application/json") {
  const headers: HeadersInit = {
    "Content-Type": contentType,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let requestBody: BodyInit | undefined;
  if (body) {
    if (contentType === "application/json") {
      requestBody = JSON.stringify(body);
    } else if (contentType === "application/x-www-form-urlencoded") {
      requestBody = new URLSearchParams(body).toString();
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Something went wrong");
  }

  // Handle cases where response might be 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
