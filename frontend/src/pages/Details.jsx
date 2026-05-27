import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PlaceCard from '../components/PlaceCard';
import dataService from '../api/data';
import { useAuth } from '../context/AuthContext';
import { getBackendAssetUrl } from '../config/api';

const Details = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedPlaces, setRelatedPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let placePayload = null;
        let rawReviews = [];

        if (id && id.startsWith('event-')) {
          const realId = id.replace('event-', '');
          const [eventResponse, reviewsResponse] = await Promise.all([
            dataService.getEventDetail(realId),
            dataService.getReviews({ event: realId }),
          ]);
          placePayload = eventResponse?.data ?? eventResponse ?? null;

          let parsedReviews = reviewsResponse ?? [];
          if (parsedReviews.results) parsedReviews = parsedReviews.results;
          if (parsedReviews.data) parsedReviews = parsedReviews.data;
          rawReviews = Array.isArray(parsedReviews) ? parsedReviews : [];
        } else {
          const [placeResponse, reviewsResponse] = await Promise.all([
            dataService.getPlaceDetail(id),
            dataService.getReviews({ place: id }),
          ]);
          placePayload = placeResponse?.data ?? placeResponse ?? null;

          let parsedReviews = reviewsResponse ?? [];
          if (parsedReviews.results) parsedReviews = parsedReviews.results;
          if (parsedReviews.data) parsedReviews = parsedReviews.data;
          rawReviews = Array.isArray(parsedReviews) ? parsedReviews : [];
        }

        setItem(placePayload);
        setReviews(rawReviews);

        if (placePayload) {
          const wilayaId = placePayload.wilaya_id || placePayload.wilaya?.id;
          if (wilayaId) {
            const relatedResponse = await dataService.getPlaces({ wilaya: wilayaId });
            const relatedRaw = relatedResponse?.data || relatedResponse || [];
            const relatedData = Array.isArray(relatedRaw)
              ? relatedRaw
              : relatedRaw.results || relatedRaw.data || [];
            const filtered = relatedData.filter(p => p.id !== placePayload.id);
            const shuffled = [...filtered].sort(() => 0.5 - Math.random());
            setRelatedPlaces(shuffled.slice(0, 3));
          }
        }
      } catch (error) {
        console.error('Failed to load details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!item) return;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some(fav => fav.id === item.id));
  }, [item]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== item.id);
    } else {
      updatedFavorites = [...favorites, item];
    }
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewError('You must be logged in to leave a review.');
      return;
    }
    if (reviewRating === 0) {
      setReviewError('Please select a star rating.');
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError('Please write a comment.');
      return;
    }
    try {
      setSubmittingReview(true);
      setReviewError(null);
      const reviewData = {
        rating: reviewRating,
        body: reviewComment,
        title: reviewComment.slice(0, 50),
        place: id.startsWith('event-') ? undefined : parseInt(id),
      };
      const response = await dataService.createReview(reviewData);
      const newReview = response?.data ?? response;
      setReviews(prev => [newReview, ...prev]);
      setReviewComment('');
      setReviewRating(0);
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-16 h-16 border-4 border-[#006699] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0F4C81] mb-4">Item Not Found</h1>
          <Link to="/" className="text-[#FF7F50] font-bold hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const placeType = id.startsWith('event-') ? 'Event' : (item.place_type_display || item.place_type || 'Place');
  const placeName = item.name || item.title;
  const placeDescription = item.description || item.short_desc || 'No description available.';
  const placeImage = item.external_image_url || item.cover_image || item.image || 'https://via.placeholder.com/1200';
  const placeWilaya = item.wilaya_name || item.wilaya?.name || 'Unknown';
  const placeRating = item.avg_rating || item.rating || (id.startsWith('event-') ? 4.9 : 0);
  const placeReviewCount = reviews.length;
  const placeOpenHours = item.open_hours || item.opening_hours || item.period || 'Daily 9:00 - 18:00';

  return (
    <div className="bg-[#F8FAFF] min-h-screen pb-20">
      <section className="relative h-[600px] w-full overflow-hidden">
        <img
          src={placeImage}
          alt={placeName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-16 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center space-x-3 mb-6">
              <span className="bg-[#006699] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {placeType}
              </span>
              <span className="bg-[#FF7F50] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {item.category?.name || 'Featured'}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h1 className="text-white text-5xl md:text-6xl font-bold max-w-3xl leading-tight">
                {placeName}
              </h1>
              <div className="flex space-x-4 mb-2">
                <button
                  onClick={toggleFavorite}
                  className={`backdrop-blur-md p-4 rounded-full transition-all border border-white/20 ${isFavorite ? 'bg-[#FF7F50] text-white' : 'bg-white/10 text-white hover:bg-[#FF7F50]'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="bg-white/10 backdrop-blur-md p-4 rounded-full text-white hover:bg-[#FF7F50] transition-all border border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-white flex items-center space-x-4">
            <div className="bg-blue-50 p-4 rounded-2xl text-[#006699]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Location</p>
              <p className="text-[#0F4C81] font-bold">{placeWilaya}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border border-white flex items-center space-x-4">
            <div className="bg-orange-50 p-4 rounded-2xl text-[#FF7F50]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Rating</p>
              <p className="text-[#0F4C81] font-bold">{placeRating} ({placeReviewCount} Reviews)</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border border-white flex items-center space-x-4">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Open Hours</p>
              <p className="text-[#0F4C81] font-bold">{placeOpenHours}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border border-white flex items-center space-x-4">
            <div className="bg-purple-50 p-4 rounded-2xl text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Reviews</p>
              <p className="text-[#0F4C81] font-bold">{placeReviewCount} Comments</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <div className="space-y-6">
            <h2 className="text-[#0F4C81] text-3xl font-bold">About this Location</h2>
            <p className="text-gray-600 text-lg leading-relaxed">{placeDescription}</p>
          </div>

          <div className="space-y-10">
            <h2 className="text-[#0F4C81] text-3xl font-bold">Visitor Opinions</h2>

            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
              <form onSubmit={handleSubmitReview}>
                <div className="flex items-start space-x-6">
                  <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
                    <img
                      src={user?.avatar
                        ? getBackendAssetUrl(user.avatar)
                        : `https://i.pravatar.cc/150?u=${user?.username}`
                      }
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#0F4C81]">
                        {user ? user.username : 'Sign in to leave a review'}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="focus:outline-none p-0.5"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-6 w-6 transition-colors ${star <= (hoveredRating || reviewRating) ? 'text-[#FF7F50]' : 'text-gray-200'}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience about this place..."
                      className="w-full bg-[#F8FAFF] rounded-2xl p-6 text-sm outline-none border border-transparent focus:border-[#FF7F50] transition-all min-h-[120px] resize-none"
                    />
                    {reviewError && (
                      <p className="text-red-500 text-xs font-medium">{reviewError}</p>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingReview || !user}
                        className="bg-[#006699] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#004d73] transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingReview ? 'Submitting...' : 'Add Your Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              {reviews.length === 0 && (
                <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to share your experience!</p>
              )}
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-6">
                    <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
                      <img
                        src={review.avatar || `https://i.pravatar.cc/150?u=${review.username || review.id}`}
                        alt={review.username || 'Guest'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-[#0F4C81]">{review.full_name || review.username || 'Guest'}</h4>
                          <p className="text-gray-400 text-xs">
                            {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Unknown date'}
                          </p>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-4 w-4 ${star <= (review.rating || 0) ? 'text-[#FF7F50]' : 'text-gray-200'}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{review.body || review.comment || review.text || ''}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="bg-white rounded-[40px] p-10 shadow-xl border border-white">
            <h3 className="text-[#0F4C81] text-xl font-bold mb-8">Key Information</h3>
            <div className="space-y-8">
              <div className="flex items-start space-x-5">
                <div className="text-[#006699] mt-1 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    {id.startsWith('event-') ? 'Venue' : 'Address'}
                  </h4>
                  <p className="text-gray-700 text-sm font-medium">{item.address || item.location}</p>
                </div>
              </div>

              <div className="flex items-start space-x-5">
                <div className="text-[#006699] mt-1 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                    {id.startsWith('event-') ? 'Event Period' : 'Opening Hours'}
                  </h4>
                  <p className="text-gray-700 text-sm font-medium">
                    {id.startsWith('event-') ? '' : 'Daily: '}{placeOpenHours}
                  </p>
                </div>
              </div>

              {item.phone && (
                <div className="flex items-start space-x-5">
                  <div className="text-[#006699] mt-1 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Contact</h4>
                    <p className="text-gray-700 text-sm font-medium">{item.phone}</p>
                  </div>
                </div>
              )}

              {item.website && (
                <div className="flex items-start space-x-5">
                  <div className="text-[#006699] mt-1 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Website</h4>
                    <a href={`https://${item.website}`} target="_blank" rel="noopener noreferrer" className="text-[#006699] text-sm font-bold hover:underline">
                      {item.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-10 shadow-xl border border-white space-y-8">
            <h3 className="text-[#0F4C81] text-xl font-bold">Related Places</h3>
            <div className="grid grid-cols-1 gap-6">
              {relatedPlaces.length > 0 ? (
                relatedPlaces.map(rel => (
                  <PlaceCard key={rel.id} item={{
                    ...rel,
                    image: rel.external_image_url || rel.cover_image,
                    location: placeWilaya,
                    wilaya: placeWilaya,
                    description: rel.short_desc || rel.description,
                    type: rel.place_type_display || rel.place_type || 'Place',
                    linkTo: `/details/${rel.id}`
                  }} />
                ))
              ) : (
                <p className="text-gray-400 text-sm">No other places in the same wilaya.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Details;