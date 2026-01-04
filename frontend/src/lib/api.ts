// frontend/src/lib/api.ts
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
  get: async (path: string) => request("GET", path, null),
  post: async (path: string, body: any) => request("POST", path, body),
  put: async (path: string, body: any) => request("PUT", path, body),
  delete: async (path: string) => request("DELETE", path, null),
  patch: async (path: string, body: any) => request("PATCH", path, body),
  postForm: async (path: string, body: any) => request("POST", path, body, "application/x-www-form-urlencoded"),
};

async function request(method: string, path: string, body: any, contentType: string = "application/json") {
  const headers: HeadersInit = {
    "Content-Type": contentType,
  };

  // Get session to extract the access token
  const session = await getSession();
  if (session && session.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
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
