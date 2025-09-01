import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Get } from '../../services/api';
import { useMovies } from '../../hooks/useMovie';
import Loading from '../../components/Loading';


const Home = () => {
    const {data, isLoading} = useMovies();

    const featuredMovies = data?.Search?? [];

    if(isLoading) return <div><Loading /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
              Discover Cinema
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Your ultimate destination for movie reviews, ratings, and cinematic discussions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/movies"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Browse Movies
              </Link>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                Join Community
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20 animate-pulse">
          <div className="w-16 h-16 bg-red-500 rounded-full"></div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20 animate-pulse delay-1000">
          <div className="w-12 h-12 bg-purple-500 rounded-full"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-red-600 mb-2">10K+</div>
              <div className="text-gray-600">Movies Reviewed</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">100K+</div>
              <div className="text-gray-600">Reviews Written</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">4.8</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Movies</h2>
            <p className="text-xl text-gray-600">Discover the most talked-about films</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredMovies.map((movie) => (
              <div key={movie.imdbID} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                    ⭐ {movie.rating}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{movie.Title}</h3>
                  <p className="text-gray-600 mb-2">{movie.Year} • {movie.Type}</p>
                  <Link
                    to={`/movie/${movie.imdbID}`}
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold"
                  >
                    Read Reviews
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/movies"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              View All Movies
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
            <p className="text-xl text-gray-600">What our community is saying</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentReviews.map((review) => (
              <div key={review.id} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{review.movie}</h3>
                  <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                    {review.rating}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{review.excerpt}"</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {review.reviewer.charAt(0)}
                  </div>
                  <span className="ml-3 text-gray-700 font-medium">{review.reviewer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join the Conversation</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Share your thoughts on the latest films and discover new favorites through our community
          </p>
          <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            Start Reviewing
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
