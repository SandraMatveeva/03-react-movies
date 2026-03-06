import { useState } from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import axios from "axios";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

const notify = () => toast("Please enter your search query.");
const notifyNoFilms = () => toast("No movies found for your request.");

interface ResponseResult {
  results: Movie[];
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movie, setMovie] = useState<Movie>();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setMovie(undefined);
  };

  const handleSubmit = async (formData: FormData) => {
    setMovies([]);

    const query = formData.get("query") as string;
    if (query === "") {
      notify();
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);
      const response = await axios.get<ResponseResult>(
        `https://api.themoviedb.org/3/search/movie?query=${query}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          },
        },
      );

      setMovies(response.data.results);
      if (response.data.results.length === 0) {
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
