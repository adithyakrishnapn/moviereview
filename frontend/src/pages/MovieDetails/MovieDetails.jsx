import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Get, Post } from "../../services/api";
import { useMovieDetails } from "../../hooks/useMovie";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

const Movie = () => {
  const { id } = useParams();
  const { data: movie, isLoading, isError } = useMovieDetails(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Review form state
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Data state
  const [reviews, setReviews] = useState([]);
  const [picture, setPicture] = useState("");
  const [inWatchlist, setInWatchlist] = useState(false);
  
  // Loading and error states
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  // Fetch reviews with proper error handling
  const fetchReviews = useCallback(async () => {
    if (!id) return;
    
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const response = await Get(`reviews/${id}`);
      setReviews(response);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviewsError("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await Get(`users/find/${user.id}`);
      setPicture(response.picture || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [user?.id]);

  // Effects
  // Check if movie is in user's watchlist
  useEffect(() => {
    async function checkWatchlist() {
      if (!user?.id || !id) return;
      try {
        const list = await Get(`watchlist/${user.id}`);
        setInWatchlist(list.some(item => item.movie._id === id));
      } catch {}
    }
    checkWatchlist();
  }, [user?.id, id]);
  <button
    onClick={async () => {
      if (!user?.id || !id) return;
      if (inWatchlist) {
        // Remove logic (optional, if you have DELETE endpoint)
        // await Delete(`watchlist/${user.id}/${id}`);
      } else {
        await Post('watchlist', { userId: user.id, movieId: id });
      }
      // Refresh watchlist state
      const list = await Get(`watchlist/${user.id}`);
      setInWatchlist(list.some(item => item.movie._id === id));
    }}
    className={`mb-4 px-4 py-2 rounded-lg font-semibold transition-colors ${inWatchlist ? 'bg-gray-300 text-gray-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
  >
    {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
  </button>
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Form validation
  const validateReviewForm = () => {
    if (!reviewTitle.trim()) {
      alert("Please enter a review title");
      return false;
    }
    if (!reviewText.trim()) {
      alert("Please enter your review");
      return false;
    }
    if (userRating === 0) {
      alert("Please select a rating");
      return false;
    }
    return true;
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!validateReviewForm()) return;
    
    // Additional auth check
    if (!user?.id) {
      alert("Please log in to submit a review");
      navigate("/login");
      return;
    }

    setIsSubmittingReview(true);
    
    try {
      const payload = {
        movie: id,
        user: user.id,
        rating: userRating,
        reviewText: reviewText.trim(),
        reviewTitle: reviewTitle.trim(),
        userName: user.username,
        movieImage: movie.Poster,
        picture,
        movieName: movie.Title,
      };

      console.log("Submitting review:", payload);

      const response = await Post("reviews", payload, {
        credentials: "include",
      });

      alert(response.message || "Review submitted successfully!");
      
      // Reset form
      setShowReviewForm(false);
      setReviewText("");
      setReviewTitle("");
      setUserRating(0);
      setHoverRating(0);
      
      // Refresh reviews
      await fetchReviews();
      
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review: " + error.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle write review button
  const handleWriteReviewClick = () => {
    if (!user) {
      alert("Please log in to write a review.");
      navigate("/login");
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

  // Loading and error states
  if (isLoading) {
    return (
      <Loading />
    );
  }

  if (isError || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Movie Not Found</h1>
          <p className="text-gray-600 mb-6">The movie you're looking for doesn't exist.</p>
          <Link
            to="/movies"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Backdrop */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={movie.Poster}
          alt={`${movie.Title} poster`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-movie.jpg'; // Add fallback image
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <img
                src={movie.Poster}
                alt={`${movie.Title} poster`}
                className="w-32 md:w-48 rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src = '/placeholder-movie.jpg';
                }}
              />
              <div className="text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-2">
                  {movie.Title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-lg">
                  <span>{movie.Year}</span>
                  <span>•</span>
                  <span>{movie.Runtime}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1" aria-label="Rating">⭐</span>
                    <span className="font-semibold">{movie.Rating}/10</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {movie.Genre}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-2">
            {/* Plot Summary */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Plot Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{movie.Plot}</p>
            </section>

            {/* Cast & Crew */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Cast & Crew
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Director</h3>
                  <p className="text-gray-700">{movie.Director}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Main Cast</h3>
                  <p className="text-gray-700">{movie.Actors}</p>
                </div>
              </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  User Reviews
                </h2>
                <button
                  onClick={handleWriteReviewClick}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  disabled={isSubmittingReview}
                >
                  {showReviewForm ? "Cancel Review" : "Write Review"}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-gray-50 p-6 rounded-lg mb-6"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Write Your Review
                  </h3>

                  {/* Review Title */}
                  <div className="mb-4">
                    <label 
                      htmlFor="reviewTitle"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Review Title *
                    </label>
                    <input
                      id="reviewTitle"
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Give your review a title..."
                      required
                      maxLength={100}
                    />
                  </div>

                  {/* Rating Stars */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating *
                    </label>
                    <div className="flex gap-1" role="radiogroup" aria-label="Movie rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className={`text-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded ${
                            (hoverRating || userRating) >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          aria-label={`Rate ${star} out of 5 stars`}
                          role="radio"
                          aria-checked={(hoverRating || userRating) >= star}
                        >
                          ⭐
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {userRating}/5
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="mb-4">
                    <label 
                      htmlFor="reviewText"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Review *
                    </label>
                    <textarea
                      id="reviewText"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Share your thoughts about this movie..."
                      required
                      maxLength={1000}
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {reviewText.length}/1000 characters
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      {isSubmittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                      disabled={isSubmittingReview}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading reviews...</p>
                </div>
              ) : reviewsError ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{reviewsError}</p>
                  <button
                    onClick={fetchReviews}
                    className="mt-2 text-red-600 hover:text-red-700 font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No reviews yet. Be the first to review this movie!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <article
                      key={review.id || `review-${review.user}-${review.timestamp}`}
                      className="border-b border-gray-200 pb-6 last:border-b-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {(() => {
                            const normalizedPicture = review.picture ? review.picture.replace(/\\/g, '/') : '';
                            const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/?$/, '/');
                            let imagePath = normalizedPicture;
                            if (imagePath.startsWith('/')) {
                              imagePath = imagePath.substring(1);
                            }
                            // Show image if available
                            if (
                              normalizedPicture &&
                              (normalizedPicture.startsWith('http') ||
                               normalizedPicture.startsWith('data:') ||
                               normalizedPicture.includes('uploads/'))
                            ) {
                              const imgLink = `${baseUrl}${imagePath}`;
                              console.log('Review user image link:', imgLink);
                              return (
                                <img
                                  src={imgLink}
                                  alt={review.userName || 'User'}
                                  className="w-12 h-12 rounded-full object-cover"
                                  onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                                />
                              );
                            }
                            // Otherwise show initial
                            return review.userName ? review.userName.charAt(0).toUpperCase() : 'U';
                          })()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review.reviewTitle || 'Untitled Review'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                by {review.userName || 'Anonymous'}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="text-yellow-400" aria-label={`Rated ${review.rating} out of 5 stars`}>
                                  ⭐ {review.rating}/5
                                </span>
                                <span>•</span>
                                <time dateTime={review.timestamp}>
                                  {review.timestamp || 'Recently'}
                                </time>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">
                            {review.reviewText}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V9a2 2 0 00-2-2H6.414a1 1 0 00-.707.293L4 9m10 1h-9m9 0c.017 0 .034.002.05.006M14 10L7 20"
                                />
                              </svg>
                              Helpful ({review.helpful || 0})
                            </button>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors">
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h5.586a1 1 0 00.707-.293L20 15m-7-10h9m-9 0c-.017 0-.034-.002-.05.006M10 10l7-10"
                                />
                              </svg>
                              Not Helpful ({review.unhelpful || 0})
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Movie Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Movie Details
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Release Date
                  </dt>
                  <dd className="text-gray-900">{movie.Released}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Box Office
                  </dt>
                  <dd className="text-gray-900">{movie.BoxOffice || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Runtime</dt>
                  <dd className="text-gray-900">{movie.Runtime}</dd>
                </div>
              </dl>
            </div>

            {/* Awards */}
            {movie.Awards && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Awards & Recognition
                </h3>
                <p className="text-gray-700">{movie.Awards}</p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${inWatchlist ? 'bg-gray-300 text-gray-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
                  onClick={async () => {
                    if (!user?.id || !movie?.imdbID) {
                      alert('User or movie not found!');
                      console.log('User or movie not found!');
                      return;
                    }
                    if (!inWatchlist) {
                      try {
                        console.log('Adding to watchlist, imdbID:', movie.imdbID);
                        const res = await Post('watchlist', {
                          userId: user.id,
                          movieId: movie.imdbID,
                          movieName: movie.Title,
                          poster: movie.Poster
                        });
                        alert('Added to watchlist!');
                        console.log('Added to watchlist:', res);
                      } catch (err) {
                        alert('Failed to add to watchlist');
                        console.log('Failed to add to watchlist:', err);
                      }
                    }
                    // Refresh watchlist state
                    try {
                      const list = await Get(`watchlist/${user.id}`);
                      setInWatchlist(list.some(item => item.movie.imdbID === movie.imdbID));
                    } catch {}
                  }}
                  disabled={inWatchlist}
                >
                  {inWatchlist ? 'Added to Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Back to Movies */}
        <nav className="mt-8">
          <Link
            to="/movies"
            className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Movies
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Movie;