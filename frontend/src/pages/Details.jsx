import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PlaceCard from '../components/PlaceCard';
import dataService from '../api/data';

const Details = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placeResponse, reviewsResponse] = await Promise.all([
          dataService.getPlaceDetail(id),
          dataService.getReviews({ place: id }),
        ]);

        // normalize place response: backend returns envelope { success, data }
        const placePayload = placeResponse?.data ?? placeResponse ?? null;
        setItem(placePayload);

        // normalize reviews : envelope { success, data }
        let rawReviews = reviewsResponse ?? [];
        if (rawReviews.results) rawReviews = rawReviews.results;
        if (rawReviews.data) rawReviews = rawReviews.data;
        setReviews(rawReviews || []);
      } catch (error) {
        console.error('Failed to load place details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const placeType = item.place_type_display || item.place_type || 'Place';
  const placeName = item.name || item.title;
  const placeDescription = item.description || item.short_desc || 'No description available.';
  const placeImage = item.cover_image || item.image;
  const placeWilaya = item.wilaya_name || item.wilaya?.name || 'Unknown';
  const placeRating = item.avg_rating || item.rating || 0;
  const placeReviewCount = reviews.length;
  const placeOpenHours = item.open_hours || item.opening_hours || 'Daily 9:00 - 18:00';

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
                <button className="bg-white/10 backdrop-blur-md p-4 rounded-full text-white hover:bg-[#FF7F50] transition-all border border-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <p className="text-gray-600 text-lg leading-relaxed">
              {placeDescription}
            </p>
          </div>

          <div className="space-y-10">
            <h2 className="text-[#0F4C81] text-3xl font-bold">Visitor Opinions</h2>
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-6">
                <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
                  <img src="https://i.pravatar.cc/150?u=user" alt="User" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#0F4C81]">user profile</span>
                    <div className="flex text-gray-200">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <textarea 
                    placeholder="add your comment..." 
                    className="w-full bg-[#F8FAFF] rounded-2xl p-6 text-sm outline-none border border-transparent focus:border-[#FF7F50] transition-all min-h-[120px] resize-none"
                  ></textarea>
                  <div className="flex justify-end">
                    <button className="bg-[#006699] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#004d73] transition-all shadow-lg shadow-blue-100">
                      Add Your Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-6">
                    <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
                      <img src={review.avatar || `https://i.pravatar.cc/150?u=${review.user || review.username || review.id}`} alt={review.user || review.username || 'Guest'} />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-[#0F4C81]">{review.user || review.username || 'Guest'}</h4>
                          <p className="text-gray-400 text-xs">{review.created_at ? new Date(review.created_at).toLocaleDateString() : review.date || 'Unknown date'}</p>
                        </div>
                        <div className="flex text-[#FF7F50]">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < (review.rating || 0) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{review.comment || review.body || review.text || review.review}</p>
                      <div className="flex items-center space-x-6 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <button className="flex items-center space-x-2 hover:text-[#FF7F50] transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          <span>24</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-[#FF7F50] transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          <span>Reply</span>
                        </button>
                      </div>
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
                  <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Address</h4>
                  <p className="text-gray-700 text-sm font-medium">{item.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-5">
                <div className="text-[#006699] mt-1 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Opening Hours</h4>
                  <p className="text-gray-700 text-sm font-medium">Daily: {placeOpenHours}</p>
                </div>
              </div>

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
            </div>
          </div>

          <div className="bg-white rounded-[40px] p-10 shadow-xl border border-white space-y-8">
            <h3 className="text-[#0F4C81] text-xl font-bold">Related Places</h3>
            <div className="grid grid-cols-1 gap-4">
              <PlaceCard item={{
                id: 'related-1',
                image: item.cover_image,
                name: item.name,
                location: placeWilaya,
                wilaya: placeWilaya,
                description: item.short_desc || item.description,
                type: placeType,
                linkTo: `/details/${item.id}`
              }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Details;
