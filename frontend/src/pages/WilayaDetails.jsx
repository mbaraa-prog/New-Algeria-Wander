import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PlaceCard from '../components/PlaceCard';
import dataService from '../api/data';

const tabs = [
  { name: 'Hotels', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5' },
  { name: 'Restaurants', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { name: 'Landmarks', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5' },
  { name: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

const WilayaDetails = () => {
  const { id } = useParams();
  const [wilaya, setWilaya] = useState(null);
  const [places, setPlaces] = useState({ attractions: [], hotels: [], restaurants: [] });
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('Hotels');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWilaya = async () => {
      try {
        const [wilayaResponse, placesResponse, eventsResponse, reviewsResponse] = await Promise.all([
          dataService.getWilayaDetail(id),
          dataService.getWilayaPlaces(id),
          dataService.getWilayaEvents(id),
          dataService.getWilayaReviews(id),
        ]);

        const wilayaPayload = wilayaResponse?.data?.data ?? wilayaResponse?.data ?? wilayaResponse ?? null;
        setWilaya(wilayaPayload);

        // Normalize places response: extract inner data object
        const placesData = placesResponse?.data?.data ?? placesResponse?.data ?? {};
        setPlaces({
          attractions: placesData.attractions || [],
          hotels: placesData.hotels || [],
          restaurants: placesData.restaurants || [],
        });

        // Normalize events response: extract inner list
        const eventsData = eventsResponse?.data?.data ?? eventsResponse?.data ?? [];
        setEvents(Array.isArray(eventsData) ? eventsData : []);

        let rv = reviewsResponse ?? [];
        if (rv.results) rv = rv.results;
        if (rv.data) rv = rv.data;
        setReviews(Array.isArray(rv) ? rv : []);
      } catch (error) {
        console.error('Failed to load wilaya details:', error);
        setError('Failed to load wilaya details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWilaya();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-16 h-16 border-4 border-[#006699] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!wilaya) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0F4C81] mb-4">Wilaya Not Found</h1>
          <Link to="/wilayas" className="text-[#FF7F50] font-bold hover:underline">Back to Wilayas</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/wilayas" className="text-[#006699] font-bold">Back to Wilayas</Link>
        </div>
      </div>
    );
  }

  const hotels = places.hotels || [];
  const restaurants = places.restaurants || [];
  const landmarks = places.attractions || [];

  const mapPlaceCard = (item) => ({
    ...item,
    image: item.cover_image,
    description: item.short_desc || item.description,
    type: item.place_type_display || item.place_type,
    wilaya: wilaya.name,
    linkTo: `/details/${item.id}`,
  });

  const eventItems = events.map(event => ({
    ...event,
    image: event.cover_image || event.external_image_url,
    description: event.description,
    type: 'Event',
    location: event.location,
    date: event.period || event.date_range,
    wilaya: event.wilaya_name,
    linkTo: `/details/event-${event.id}`,
  }));

  const activeItems = activeTab === 'Hotels'
    ? hotels
    : activeTab === 'Restaurants'
      ? restaurants
      : activeTab === 'Landmarks'
        ? landmarks
        : eventItems;

  const activeSectionTitle = activeTab === 'Hotels'
    ? 'Best Stays'
    : activeTab === 'Restaurants'
      ? 'Popular Restaurants'
      : activeTab === 'Landmarks'
        ? 'Must-See Landmarks'
        : 'Upcoming Events';

  const activeSectionDescription = activeTab === 'Hotels'
    ? `Browse recommended hotels in ${wilaya.name}.`
    : activeTab === 'Restaurants'
      ? `Discover the top restaurants across ${wilaya.name}.`
      : activeTab === 'Landmarks'
        ? `Explore historical landmarks and sights in ${wilaya.name}.`
        : `Catch the latest events happening in ${wilaya.name}.`;

  return (
    <div className="bg-[#F8FAFF] min-h-screen pb-24">
      <section className="relative h-[650px] w-full overflow-hidden">
        <img 
          src={wilaya.banner_image || wilaya.cover_image}
          alt={wilaya.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="absolute bottom-20 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6">
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">
              {wilaya.category?.name || wilaya.tags_list?.[0] || 'Destination'}
            </span>
            <h1 className="text-white text-7xl font-bold mb-6 tracking-tight">{wilaya.name}</h1>
            <p className="text-white/80 text-xl max-w-2xl leading-relaxed mb-10">
              {wilaya.short_desc || wilaya.description}
            </p>
            <div className="flex items-center space-x-6">
              <button className="bg-[#91470A] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#7a3c08] transition-all shadow-xl shadow-orange-900/20">
                Plan Trip
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-2xl font-bold flex items-center space-x-3 hover:bg-white/20 transition-all border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>View Map</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 sticky top-[72px] z-40 px-6">
        <div className="max-w-7xl mx-auto flex items-center space-x-12">
          {tabs.map(tab => (
            <button 
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center space-x-3 py-6 text-sm font-bold border-b-2 transition-all ${
                activeTab === tab.name 
                  ? 'text-[#006699] border-[#006699]' 
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              <span>{tab.name === 'Hotels' ? 'Hotels & Stays' : tab.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-[#0F4C81] text-4xl font-bold">{activeSectionTitle}</h2>
            <p className="text-gray-400 font-medium">{activeSectionDescription}</p>
          </div>
          <Link to="/search" className="text-[#006699] font-bold flex items-center space-x-2 hover:underline">
            <span>Explore all</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {activeItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeItems.map(item => (
              <PlaceCard key={item.id} item={activeTab === 'Events' ? item : mapPlaceCard(item)} />
            ))}
          </div>
        ) : (
          <div className="rounded-[40px] bg-white p-16 shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No {activeTab.toLowerCase()} available for this wilaya yet.</p>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        <div className="space-y-12">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-[#0F4C81] text-4xl font-bold">Featured Stays</h2>
              <p className="text-gray-400 font-medium">Top-rated accommodations in {wilaya.name}.</p>
            </div>
            <Link to="/search" className="text-[#006699] font-bold flex items-center space-x-2 hover:underline">
              <span>View All</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr] gap-8">
            {hotels[0] ? (
              <div className="lg:col-span-1 h-[550px]">
                <Link to={`/details/${hotels[0].id}`} className="relative block h-full rounded-[40px] overflow-hidden group shadow-xl">
                  <img src={hotels[0].cover_image} alt={hotels[0].name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#006699]/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Top Pick
                    </span>
                  </div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex text-orange-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-white text-xs font-bold">{hotels[0].avg_rating || '5.0'} ({hotels[0].review_count || 0} reviews)</span>
                    </div>
                    <h3 className="text-white text-3xl font-bold mb-3">{hotels[0].name}</h3>
                    <p className="text-white/70 text-sm mb-6 line-clamp-2">{hotels[0].short_desc || hotels[0].description}</p>
                    <button className="bg-[#006699] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#004d73] transition-all">
                      View Details
                    </button>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="lg:col-span-1 h-[550px] bg-white rounded-[40px] shadow-xl flex items-center justify-center text-center p-10">
                <p className="text-gray-500">No hotel recommendations available for this wilaya.</p>
              </div>
            )}

            <div className="lg:col-span-1 space-y-8">
              {hotels.slice(1, 3).map(hotel => (
                <Link key={hotel.id} to={`/details/${hotel.id}`} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group h-[260px] border border-gray-50">
                  <div className="h-2/3 overflow-hidden">
                    <img src={hotel.cover_image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-[#FF7F50] text-xs font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        {hotel.avg_rating || '4.5'}
                      </div>
                      <span className="text-[#006699] text-[10px] font-bold uppercase">Details</span>
                    </div>
                    <h4 className="text-[#0F4C81] font-bold text-sm mb-1">{hotel.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400 text-xs font-medium truncate max-w-[150px]">{hotel.short_desc || hotel.description}</p>
                      <span className="text-gray-600 text-xs font-bold">{hotel.category?.name || hotel.place_type_display || 'Stay'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#E9E4D4] rounded-[40px] h-[550px] p-12 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg text-[#006699]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-[#0F4C81] text-4xl font-bold">Can't decide?</h3>
                <p className="text-gray-600 text-lg">
                  Let our travel experts curate the perfect stay tailored to your preferences.
                </p>
                <button className="bg-[#006699] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#004d73] transition-all shadow-xl shadow-blue-900/10">
                  Get Recommendations
                </button>
              </div>
            </div>
          </div>
        </div>

        {landmarks.length > 0 && (
          <div className="space-y-12">
            <h2 className="text-[#0F4C81] text-4xl font-bold">Historical Landmarks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {landmarks.map(item => (
                <PlaceCard key={item.id} item={mapPlaceCard(item)} />
              ))}
            </div>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="space-y-10">
            <h2 className="text-[#0F4C81] text-4xl font-bold">Traveler Reviews</h2>
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="h-14 w-14 rounded-full overflow-hidden flex-shrink-0">
                      <img src={review.avatar || 'https://i.pravatar.cc/150?u=review'} alt={review.full_name || review.username} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-6 mb-3">
                        <div>
                          <h4 className="font-bold text-[#0F4C81]">{review.full_name || review.username}</h4>
                          <p className="text-gray-400 text-xs">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex text-[#FF7F50] text-sm font-bold">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{review.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default WilayaDetails;
