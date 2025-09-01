import { useQuery } from "@tanstack/react-query";
import { Get } from "../services/api";

// Fetch list of movies
export const useMovies = () => {
  return useQuery({
    queryKey: ["movies"],
    queryFn: () => Get("movies"),
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 60,
  });
};

// Fetch details of a single movie
export const useMovieDetails = (id) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => Get(`movies/${id}`),
    enabled: !!id, // only fetch if id exists
    staleTime: 1000 * 60 * 20, 
    cacheTime: 1000 * 60 * 60,
  });
};
