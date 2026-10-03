const API_BASE =
  typeof window !== "undefined"
    ? "/api"
    : process.env.NEXTAUTH_URL
      ? `${process.env.NEXTAUTH_URL}/api`
      : "http://localhost:3000/api";

export async function api<T = any>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string>),
    },
    ...init,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed: ${res.status}`);
    (err as any).status = res.status;
    (err as any).body = data;
    throw err;
  }
  return data;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("civic_token");
}

export function setToken(t: string) {
  if (typeof window !== "undefined") localStorage.setItem("civic_token", t);
}

export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem("civic_token");
}

export function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function get<T = any>(path: string) {
  return api<T>(path, { headers: authHeaders() });
}

export async function post<T = any>(path: string, body?: any) {
  return api<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    headers: authHeaders(),
  });
}

export async function patch<T = any>(path: string, body?: any) {
  return api<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
    headers: authHeaders(),
  });
}

export async function del<T = any>(path: string) {
  return api<T>(path, { method: "DELETE", headers: authHeaders() });
}