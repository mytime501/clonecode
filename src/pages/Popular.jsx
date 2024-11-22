import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Header from '../components/Header';
import "../css/popular.css";

const Popular = () => {
  const [movies, setMovies] = useState([]);
  const [viewType, setViewType] = useState("infinite"); // "table" or "infinite"
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = JSON.parse(localStorage.getItem("isAuthenticated"))?.token;
  const BASE_URL = "https://api.themoviedb.org/3/movie/popular";

  // Fetch movies
  const fetchMovies = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&page=${page}`);
      const data = await response.json();
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  // Handle Infinite Scroll
  const handleScroll = () => {
    if (viewType === "infinite") {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight - 10 && !isLoading) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    if (viewType === "infinite") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [viewType, isLoading]);

  return (
    <div>
        <Header />
        <div className="popular-container">
            <div className="view-toggle">
                <button onClick={() => setViewType("table")} className={viewType === "table" ? "active" : ""}>
                Table View
                </button>
                <button onClick={() => setViewType("infinite")} className={viewType === "infinite" ? "active" : ""}>
                Infinite Scroll
                </button>
            </div>

            {viewType === "table" ? (
                <div className="table-view">
                <table>
                    <thead>
                    <tr>
                        <th>Poster</th>
                        <th>Title</th>
                        <th>Overview</th>
                        <th>Rating</th>
                        <th>Release Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {movies.map((movie) => (
                        <tr key={movie.id}>
                        <td>
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                        </td>
                        <td>{movie.title}</td>
                        <td>{movie.overview}</td>
                        <td>{movie.vote_average}</td>
                        <td>{movie.release_date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>
            ) : (
                <div className="infinite-scroll-view">
                <div className="movies-grid">
                    {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
                {isLoading && <p className="loading-text">Loading...</p>}
                </div>
            )}

            <ScrollToTopButton />
        </div>
    </div>
    
  );
};

export default Popular;
