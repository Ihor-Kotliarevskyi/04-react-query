import axios from "axios";
import type { MoviesHttpResponse } from "../types/movie";

const MY_KEY = import.meta.env.VITE_TMDB_TOKEN;

export const fetchMovies = async (
  query: string,
  currentPage: number
): Promise<MoviesHttpResponse> => {
  const options = {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page: currentPage,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${MY_KEY}`,
    },
  };

  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    options
  );

  return response.data;
};
