export interface Era {
  id: string;
  name: string;
  image: string;
}

export async function fetchEras(): Promise<Era[]> {
  try {
    const res = await fetch("http://localhost:8000/api/eras"); 
    if (!res.ok) throw new Error("Failed to fetch eras");
    const data: Era[] = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}