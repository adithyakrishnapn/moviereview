import { useEffect, useState } from 'react';
import { data, Link } from 'react-router-dom';
import { Get } from '../../services/api';
import { useMovies } from '../../hooks/useMovie';
import Loading from '../../components/Loading';

const MovieListing = () => {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useMovies();

  const genres = ['all', 'movie', 'series', 'episode'];


  const movies = data?.Search ?? [];

  // Filter movies
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.Title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || movie.Type === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Sorting (using Year or Title, since rating/popularity not in OMDb basic response)
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'year':
        return parseInt(b.Year) - parseInt(a.Year);
      case 'title':
        return a.Title.localeCompare(b.Title);
      default:
        return 0;
    }
  });

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Movies</h1>
          <p className="text-xl text-gray-200">Explore our vast collection of films and find your next favorite</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg"
            />

            {/* Genre */}
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg"
            >
              <option value="popularity">Sort by Popularity</option>
              <option value="year">Sort by Year</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 text-gray-600">
          Showing {sortedMovies.length} of {movies.length} movies
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedMovies.map((movie) => (
            <div key={movie.imdbID} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}
                alt={movie.Title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold">{movie.Title}</h3>
                <p className="text-gray-600">{movie.Year} • {movie.Type}</p>
                <Link to={`/movie/${movie.imdbID}`} className="text-red-600 hover:underline text-sm">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedMovies.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold">No movies found</h3>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('all');
                setSortBy('popularity');
              }}
              className="mt-4 bg-red-600 text-white px-6 py-3 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieListing;
