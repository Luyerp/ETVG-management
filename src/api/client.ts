const API_BASE = "";

export function getToken(): string | null {
  return localStorage.getItem("etvg_token");
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("etvg_token", token);
  else localStorage.removeItem("etvg_token");
}

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(typeof data.error === "string" ? data.error : res.statusText);
  }
  return data as T;
}

export function formatEntryDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function canManageMembers(roleDescription: string | undefined): boolean {
  return roleDescription === "Leader" || roleDescription === "Assistance";
}
