import { apiFetch } from "./fetch";
import type { Era } from "../types";

export async function fetchEras(signal?: AbortSignal): Promise<Era[]> {
  const data = await apiFetch<any>("/api/eras", { signal });

  if (Array.isArray(data)) return data as Era[];
  if (data && Array.isArray((data as any).eras)) return (data as any).eras as Era[];
  if (data && Array.isArray((data as any).data)) return (data as any).data as Era[];

  // Unexpected shape — return empty but let caller handle empty arrays.
  console.warn("fetchEras: unexpected response shape", data);
  return [];
}