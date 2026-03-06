import axios from "axios";
import type { Movie } from "../types/movie";

interface ResponseResult {
  results: Movie[];
}

export default async function fetchMovies(query: string) {
  return await axios.get<ResponseResult>(
    `https://api.themoviedb.org/3/search/movie?query=${query}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );
}
