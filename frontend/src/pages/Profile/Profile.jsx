import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Delete, Get, Put } from '../../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState({});
  const [pictureFile, setPictureFile] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    async function fetchDetails() {
      if (user && user.id) {
        try {
          const data = await Get(`users/find/${user.id}`);
          setDetails(data);
        } catch (err) {
          setDetails(user); // fallback to context
        }
      }
    }
    fetchDetails();
  }, [user]);

  useEffect(() => {
    async function fetchReviews() {
      if (user && user.id) {
        try {
          const data = await Get(`reviews/rev/${user.id}`);
          setRecentReviews(data);
          console.log(data);
        } catch (err) {
          setRecentReviews([]);
        }
      }
    }
    fetchReviews();

    async function fetchWatchlistWithDetails() {
      if (user && user.id) {
        try {
          const data = await Get(`watchlist/${user.id}`);
          // data is array of { user, movie } where movie is imdbID
          const detailed = await Promise.all(
            data.map(async (item) => {
              try {
                const movieDetails = await Get(`movies/${item.movie}`); // assumes movies/:imdbID endpoint
                return { ...item, movieDetails };
              } catch {
                return { ...item, movieDetails: null };
              }
            })
          );
          setWatchlist(detailed);
        } catch (err) {
          setWatchlist([]);
        }
      }
    }
    fetchWatchlistWithDetails();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', details.name || details.username || '');
      formData.append('email', details.email || '');
      if (pictureFile) {
        formData.append('picture', pictureFile);
      } else {
        formData.append('picture', details.picture || '');
      }
      await Put(`users/${user.id}`, formData);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const deleteReview = async(reviewId) => {
    const response = await Delete(`reviews/${reviewId}`);
    setRecentReviews(prev => prev.filter(review => review._id !== reviewId));
  };

  const deleteFromWatchlist = async (item) => {
    try {
      // Use imdbID string from backend (item.movie)
      await Delete(`watchlist/${user.id}/${item.movie}`);
      setWatchlist(prev => prev.filter(w => w._id !== item._id));
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center text-4xl font-bold">
              {(() => {
                const normalizedPicture = details.picture ? details.picture.replace(/\\/g, '/') : '';
                const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/?$/, '/');
                let imagePath = normalizedPicture;
                if (imagePath.startsWith('/')) {
                  imagePath = imagePath.substring(1);
                }
                if (
                  normalizedPicture.startsWith('http') ||
                  normalizedPicture.startsWith('data:') ||
                  normalizedPicture.includes('uploads/')
                ) {
                  const imgLink = `${baseUrl}${imagePath}`;
                  console.log('Profile image link:', imgLink);
                  return (
                    <img
                      src={imgLink}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                      onError={e => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }}
                    />
                  );
                }
                return <span>{details.picture || (details.name || details.username || '').charAt(0)}</span>;
              })()}
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="text-4xl font-bold mb-2 md:mb-0">{details.username || details.name}</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white text-purple-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
              <p className="text-xl text-purple-100 mb-2">{details.email}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>📅 Joined {details.joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={details.name || details.username || ""}
                  onChange={(e) => setDetails(prev => ({...prev, name: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={details.email || ""}
                  onChange={(e) => setDetails(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <input
                  type="file"
                  name="picture"
                  accept="image/*"
                  onChange={e => setPictureFile(e.target.files[0])}
                  className="w-full text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                />
                <div className="mt-2">
                  <input
                    type="text"
                    value={details.picture || ""}
                    onChange={e => setDetails(prev => ({...prev, picture: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Paste image URL or avatar text"
                  />
                </div>
                {pictureFile && (
                  <div className="mt-2">
                    <img src={URL.createObjectURL(pictureFile)} alt="Preview" className="h-20 w-20 rounded-full object-cover" />
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSaveProfile}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Reviews */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Reviews</h2>
          <div className="space-y-6">
            {recentReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{review.movieName}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-yellow-500 font-semibold">⭐ {review.rating}/10</span>
                        <span className="text-gray-500 text-sm">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{review.reviewText}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-32 rounded-lg overflow-hidden border-2 border-purple-500 shadow-md flex items-center justify-center bg-gray-200">
                          {review.movieImage ? (
                            <img 
                              src={review.movieImage} 
                              alt={review.userName} 
                              className="h-full w-full object-cover" 
                              style={{ minHeight: '80px', minWidth: '128px', background: '#e5e7eb' }}
                              onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
                            />
                          ) : null}
                        </div>
                        <span className="flex items-center gap-1 text-gray-500">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </span>
                      </div>
                      <button
                        onClick={() => deleteReview(review._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {recentReviews.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600">Start writing reviews for movies you've watched!</p>
              </div>
            )}
          </div>
        </div>

        {/* Watchlist */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Watchlist</h2>
          {watchlist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watchlist.map((item) => {
                // Prefer backend fields, fallback to movieDetails if needed
                const poster = item.poster || item.movieDetails?.poster || '/default-movie.png';
                const title = item.movieName || item.movieDetails?.title || item.movie;
                const year = item.movieDetails?.year || '';
                const rating = item.movieDetails?.rating || '';
                return (
                  <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative">
                      <img
                        src={poster}
                        alt={title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {rating ? `⭐ ${rating}` : ''}
                      </div>
                      <button
                        onClick={() => deleteFromWatchlist(item)}
                        className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full transition-colors"
                        title="Remove from watchlist"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{title}</h3>
                      <p className="text-gray-600 text-xs">{year}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your watchlist is empty</h3>
              <p className="text-gray-600">Add movies you want to watch later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;