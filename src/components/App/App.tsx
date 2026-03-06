import { useState } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import fetchMovies from "../../services/movieService";

const notifyNoFilms = () => toast("No movies found for your request.");

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setMovie(null);
  };

  const handleSubmit = async (query: string) => {
    setMovies([]);

    try {
      setIsLoading(true);
      setIsError(false);
      const response = await fetchMovies(query);

      setMovies(response);
      if (response.length === 0) {
        notifyNoFilms();
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickFilm = (movie: Movie): void => {
    openModal();
    setMovie(movie);
  };
  const totalMovies = movies.length;

  return (
    <>
      <SearchBar onSubmit={handleSubmit} />
      <Toaster />

      {isLoading && <Loader />}
      {totalMovies !== 0 && (
        <MovieGrid onSelect={handleClickFilm} movies={movies} />
      )}
      {isError && <ErrorMessage />}

      {isModalOpen && movie && (
        <MovieModal movie={movie} onClose={closeModal} />
      )}
    </>
  );
}
