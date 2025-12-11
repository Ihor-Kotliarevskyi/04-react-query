import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesHttpResponse {
  results: Movie[];
}
const MY_KEY = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const options = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${MY_KEY}`,
    },
  };
  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
    options
  );

  return response.data.results;
};
