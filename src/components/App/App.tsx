import { useState } from "react";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import { fetchMovies } from "../../services/movieService";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

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

  const handleSearch = async (query: string) => {
    try {
      setMovies([]);
      setIsLoading(true);
      setIsError(false);
      const data = await fetchMovies(query);

      if (data.length) {
        setMovies(data);
      } else {
        toast.error("No movies found for your request.");
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {movies.length > 0 && <MovieGrid onSelect={openModal} movies={movies} />}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
      <Toaster position="top-center" reverseOrder={true} />
    </>
  );
}

export default App;
