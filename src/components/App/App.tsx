import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import Pagination from "../Pagination/Pagination";

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState<string>("");

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  const {
    data: { results = [], total_pages = 0, total_results = 0 } = {},
    error,
    isError,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isPending && total_results === 0) {
      toast.error("No movies found for your request.");
    }
  }, [total_results, isPending]);

  const totalPages = total_pages ?? 0;

  const openModal = ({
    id,
    poster_path,
    backdrop_path,
    title,
    overview,
    release_date,
    vote_average,
  }: Movie) => {
    setSelectedMovie({
      id,
      poster_path,
      backdrop_path,
      title,
      overview,
      release_date,
      vote_average,
    });
  };
  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <div className={css.app}>
        <SearchBar onSubmit={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        <MovieGrid onSelect={openModal} movies={results || []} />
        {isLoading && <Loader />}
        {isError && <ErrorMessage error={error.message} />}
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
        {selectedMovie && (
          <MovieModal onClose={closeModal} movie={selectedMovie} />
        )}
        <Toaster position="top-center" reverseOrder={true} />
      </div>
    </>
  );
}

export default App;
