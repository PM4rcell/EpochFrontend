export interface Era {
  id: string;
  name: string;
  image: string;
}

export async function fetchEras(): Promise<Era[]> {
  try {
    const res = await fetch("http://localhost:8000/api/eras"); 
    if (!res.ok) throw new Error("Failed to fetch eras");
    const data = await res.json();

    if (Array.isArray(data)) return data as Era[];
    if (data && Array.isArray((data as any).eras)) return (data as any).eras as Era[];
    if (data && Array.isArray((data as any).data)) return (data as any).data as Era[];

    console.warn("fetchEras: unexpected response shape", data);
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}