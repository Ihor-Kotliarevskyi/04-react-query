import type { Movie } from "../../types/movie";
import css from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map(
        ({
          id,
          poster_path,
          backdrop_path,
          title,
          overview,
          release_date,
          vote_average,
        }) => (
          <li
            onClick={() =>
              onSelect({
                id,
                poster_path,
                backdrop_path,
                title,
                overview,
                release_date,
                vote_average,
              })
            }
            key={id}
          >
            <div className={css.card}>
              <img
                className={css.image}
                src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                alt={title}
                loading="lazy"
              />
              <h2 className={css.title}>{title}</h2>
            </div>
          </li>
        )
      )}
    </ul>
  );
}

export default MovieGrid;
