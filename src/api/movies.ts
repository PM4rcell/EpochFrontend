import { apiFetch } from "./fetch";

// Movie interface representing the structure of a movie object
export interface Movie {
    id: number;
    era_id: number;
    director_id: number;
    title: string;
    description: string;
    vote_avg: number;
    imdb_id: number;
    omdb_category: string;
    age_rating: string;
    release_date: string; // ISO date string (YYYY-MM-DD)
    runtime_min: number;
    is_featured: boolean;
    slug: string;
    trailer_link: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

//fetches movies by era id
export async function fetchMoviesByEra(eraId: number, signal?: AbortSignal): Promise<Movie[]> {
    const data = await apiFetch<any>(`/api/movies?era_id=${eraId}`, { signal });

    if (Array.isArray(data)) return data as Movie[];
    if (data && Array.isArray((data as any).movies)) return (data as any).movies as Movie[];
    if (data && Array.isArray((data as any).data)) return (data as any).data as Movie[];
    if (data && Array.isArray((data as any).items)) return (data as any).items as Movie[];

    console.warn("fetchMoviesByEra: unexpected response shape", data);
    return [];
}

//fetches a single movie by its ID
export async function fetchMovieById(movieId: number, signal?: AbortSignal): Promise<Movie | null> {
    const data = await apiFetch<any>(`/api/movies/${movieId}`, { signal });

    if (data && typeof data === "object" && !Array.isArray(data)) return data as Movie;
    if (data && data.movie && typeof data.movie === "object") return data.movie as Movie;
    if (data && data.data && typeof data.data === "object") return data.data as Movie;

    console.warn("fetchMovieById: unexpected response shape", data);
    return null;
}

//fetches similar movies based on a given movie ID
export async function fetchSimilarMovies(movieId: number, signal?: AbortSignal): Promise<Movie[]> {
    const data = await apiFetch<any>(`/api/movies/${movieId}/similar`, { signal });

    if (Array.isArray(data)) return data as Movie[];
    if (data && Array.isArray((data as any).movies)) return (data as any).movies as Movie[];
    if (data && Array.isArray((data as any).data)) return (data as any).data as Movie[];
    if (data && Array.isArray((data as any).items)) return (data as any).items as Movie[];

    console.warn("fetchSimilarMovies: unexpected response shape", data);
    return [];
}

export async function fetchMoviesByTitle(title: string, signal?: AbortSignal): Promise<Movie[]> {
    const data = await apiFetch<any>(`/api/movies?q=${encodeURIComponent(title)}`, { signal });

    if (Array.isArray(data)) return data as Movie[];
    if (data && Array.isArray((data as any).movies)) return (data as any).movies as Movie[];
    if (data && Array.isArray((data as any).data)) return (data as any).data as Movie[];
    if (data && Array.isArray((data as any).items)) return (data as any).items as Movie[];

    console.warn("fetchSimilarMovies: unexpected response shape", data);
    return [];
}