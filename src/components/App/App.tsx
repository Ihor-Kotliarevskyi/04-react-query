import { useState } from "react";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState<string>("");

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  const result = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  });

  const totalPages = result.data?.total_pages ?? 0;

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
      <SearchBar onSubmit={handleSearch} />
      <MovieGrid onSelect={openModal} movies={result.data?.results || []} />
      {result.isLoading && <Loader />}
      {result.isError && <ErrorMessage error={result.error.message} />}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
      <Toaster position="top-center" reverseOrder={true} />
    </>
  );
}

export default App;
