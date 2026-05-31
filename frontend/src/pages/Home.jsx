import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PlaceCard from '../components/PlaceCard';
import dataService from '../api/data';
import { getImageUrl } from '../config/api';

import coastHero from '../assets/generated/coast_hero.png';
import mountainHero from '../assets/generated/mountain_hero.png';
import saharaHero from '../assets/generated/sahara_hero.png';
import historyHero from '../assets/generated/history_hero.png';
import algerLaBlanche from '../assets/Alger la blanche front de mer ❤️🇩🇿.jpg';
import trainParis from '../assets/Take the train from Paris to Venice via Switzerland.jpg';
import download3 from '../assets/download (3).jpg';

const Home = () => {
  const [homeSearch, setHomeSearch] = useState('');
  const [heroSlides, setHeroSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [places, setPlaces] = useState([]);
  const [wilayas, setWilayas] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredCards, setFilteredCards] = useState([]);
  const [discoverIndex, setDiscoverIndex] = useState(0);
  const [shuffledEvents, setShuffledEvents] = useState([]);
  const [eventIndex, setEventIndex] = useState(0);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [hotels_index, setHotelsIndex] = useState(0);
  const [restaurants_index, setRestaurantsIndex] = useState(0);
  const [events_index, setEventsIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const shuffleArray = (arr) => {
    return [...arr].sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [response, placesResponse, wilayasResponse] = await Promise.all([
          dataService.getHomeData(),
          dataService.getPlaces(),
          dataService.getWilayas()
        ]);
        const data = response?.data || response || {};
        setHeroSlides(data.hero_slides || []);
        setCategories(data.categories || []);
        setFeaturedDestinations(data.featured_destinations || []);
        setUpcomingEvents(data.upcoming_events || []);

        // ── FIX: normalize places array regardless of API response shape ──
        let placesItems = [];
        if (Array.isArray(placesResponse)) placesItems = placesResponse;
        else if (Array.isArray(placesResponse?.data)) placesItems = placesResponse.data;
        else if (Array.isArray(placesResponse?.results)) placesItems = placesResponse.results;
        setPlaces(placesItems);

        // ── FIX: normalize wilayas array regardless of API response shape ──
        let wilayasItems = [];
        if (Array.isArray(wilayasResponse)) wilayasItems = wilayasResponse;
        else if (Array.isArray(wilayasResponse?.data)) wilayasItems = wilayasResponse.data;
        else if (Array.isArray(wilayasResponse?.results)) wilayasItems = wilayasResponse.results;
        setWilayas(wilayasItems);

        setDataLoaded(true);
      } catch (error) {
        console.error('Failed to load home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    if (places.length === 0) return;
    let items = [];
    let hotelsArray = [];
    let restaurantsArray = [];

    if (activeCategory === 'All') {
      items = places.filter(p => p.place_type !== 'hotel' && p.place_type !== 'restaurant').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: p.place_type_display || p.place_type || 'Place',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
      items = shuffleArray(items);
      hotelsArray = places.filter(p => p.place_type === 'hotel').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: 'Hotel',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
      restaurantsArray = places.filter(p => p.place_type === 'restaurant').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: 'Restaurant',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
    } else if (activeCategory === 'Beaches') {
      const beachWilayas = ['Oran', 'Annaba', 'Algiers', 'Bejaia'];
      const filteredWilayas = wilayas.filter(w => beachWilayas.includes(w.name)).map(w => ({
        id: `wilaya-${w.id}`,
        name: w.name,
        image: getImageUrl(w),
        description: w.short_desc || w.description,
        type: 'Destination',
        location: 'Algeria',
        rating: 5.0,
        linkTo: `/wilaya/${w.id}`
      }));
      const filteredPlaces = places.filter(p => beachWilayas.includes(p.wilaya_name) && (p.place_type === 'attraction' || p.category?.name === 'Landmarks') && p.place_type !== 'hotel' && p.place_type !== 'restaurant').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: p.place_type_display || p.place_type || 'Landmark',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
      items = shuffleArray([...filteredWilayas, ...filteredPlaces]);
      hotelsArray = places.filter(p => beachWilayas.includes(p.wilaya_name) && p.place_type === 'hotel').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: 'Hotel',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
      restaurantsArray = places.filter(p => beachWilayas.includes(p.wilaya_name) && p.place_type === 'restaurant').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: 'Restaurant',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
    } else if (activeCategory === 'Sahara') {
      const djanetWilaya = wilayas.filter(w => w.name.toLowerCase().includes('djanet')).map(w => ({
        id: `wilaya-${w.id}`,
        name: w.name,
        image: getImageUrl(w),
        description: w.short_desc || w.description,
        type: 'Destination',
        location: 'Algeria',
        rating: 5.0,
        linkTo: `/wilaya/${w.id}`
      }));
      const djanetPlaces = places.filter(p => p.wilaya_name.toLowerCase().includes('djanet') && (p.place_type === 'attraction' || p.category?.name === 'Landmarks') && p.place_type !== 'hotel' && p.place_type !== 'restaurant').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: p.place_type_display || p.place_type || 'Landmark',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
      items = [...djanetWilaya, ...djanetPlaces];
      hotelsArray = places.filter(p => p.wilaya_name.toLowerCase().includes('djanet') && p.place_type === 'hotel').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: 'Hotel',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
      restaurantsArray = places.filter(p => p.wilaya_name.toLowerCase().includes('djanet') && p.place_type === 'restaurant').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: 'Restaurant',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
    } else if (activeCategory === 'Mountains') {
      const bejaiaWilaya = wilayas.filter(w => w.name.toLowerCase().includes('bejaia')).map(w => ({
        id: `wilaya-${w.id}`,
        name: w.name,
        image: getImageUrl(w),
        description: w.short_desc || w.description,
        type: 'Destination',
        location: 'Algeria',
        rating: 5.0,
        linkTo: `/wilaya/${w.id}`
      }));
      const mtKeywords = ['mountain', 'gouraya', 'carbon', 'clif', 'massif', 'park', 'peak', 'sentinel', 'height'];
      const bejaiaPlaces = places.filter(p =>
        p.wilaya_name.toLowerCase().includes('bejaia') &&
        (p.place_type === 'attraction' || p.category?.name === 'Landmarks') &&
        p.place_type !== 'hotel' && p.place_type !== 'restaurant' &&
        mtKeywords.some(kw => (p.name + ' ' + p.description).toLowerCase().includes(kw))
      ).map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: p.place_type_display || p.place_type || 'Landmark',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
      items = [...bejaiaWilaya, ...bejaiaPlaces];
      hotelsArray = places.filter(p => p.wilaya_name.toLowerCase().includes('bejaia') && p.place_type === 'hotel').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: 'Hotel',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
      restaurantsArray = places.filter(p => p.wilaya_name.toLowerCase().includes('bejaia') && p.place_type === 'restaurant').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: 'Restaurant',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
    } else if (activeCategory === 'History') {
      const constWilaya = wilayas.filter(w => w.name.toLowerCase().includes('constantine')).map(w => ({
        id: `wilaya-${w.id}`,
        name: w.name,
        image: getImageUrl(w),
        description: w.short_desc || w.description,
        type: 'Destination',
        location: 'Algeria',
        rating: 5.0,
        linkTo: `/wilaya/${w.id}`
      }));
      const historyKeywords = ['history', 'ancient', 'ruins', 'roman', 'museum', 'monument', 'timgad', 'djemila', 'bridge'];
      const historyPlaces = places.filter(p =>
        (p.place_type === 'attraction' || p.category?.name === 'Landmarks' || p.category?.name === 'Museum' || p.category?.name === 'History') &&
        p.place_type !== 'hotel' && p.place_type !== 'restaurant' &&
        historyKeywords.some(kw => (p.name + ' ' + p.description).toLowerCase().includes(kw))
      ).map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: p.place_type_display || p.place_type || 'Landmark',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
      items = [...constWilaya, ...historyPlaces];
      hotelsArray = places.filter(p => p.place_type === 'hotel').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: 'Hotel',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
      restaurantsArray = places.filter(p => p.place_type === 'restaurant').map(p => ({
        id: p.id,
        name: p.name,
        image: getImageUrl(p),
        description: p.short_desc || p.description,
        type: 'Restaurant',
        location: p.wilaya_name,
        rating: p.avg_rating || p.rating || 5.0,
        linkTo: `/details/${p.id}`
      }));
    }
    setFilteredCards(items);
    setHotels(hotelsArray);
    setRestaurants(restaurantsArray);
    setDiscoverIndex(0);
    setHotelsIndex(0);
    setRestaurantsIndex(0);
  }, [activeCategory, places, wilayas]);

  useEffect(() => {
    if (upcomingEvents.length > 0) {
      setShuffledEvents(shuffleArray(upcomingEvents));
      setEventIndex(0);
    }
  }, [upcomingEvents, dataLoaded]);

  const handleDiscoverPrev = () => setDiscoverIndex(prev => Math.max(0, prev - 1));
  const handleDiscoverNext = () => setDiscoverIndex(prev => Math.min(Math.max(0, filteredCards.length - 3), prev + 1));
  const handleHotelsPrev = () => setHotelsIndex(prev => Math.max(0, prev - 1));
  const handleHotelsNext = () => setHotelsIndex(prev => Math.min(Math.max(0, hotels.length - 3), prev + 1));
  const handleRestaurantsPrev = () => setRestaurantsIndex(prev => Math.max(0, prev - 1));
  const handleRestaurantsNext = () => setRestaurantsIndex(prev => Math.min(Math.max(0, restaurants.length - 3), prev + 1));
  const handleEventPrev = () => setEventIndex(prev => Math.max(0, prev - 1));
  const handleEventNext = () => setEventIndex(prev => Math.min(Math.max(0, shuffledEvents.length - 3), prev + 1));

  const defaultThemes = [
    {
      id: 'beaches',
      category: 'Explore Algeria',
      title: 'Discover the coasts of Algeria',
      description: "Explore stunning Mediterranean beaches, vibrant coastal cities, and hidden gems along Algeria's breathtaking shoreline.",
      mainImage: 'https://res.cloudinary.com/df9dmkiuj/image/upload/v1779484617/3501e1681cbb79a207dd824c1f12d6c6_djpnsd.jpg', // Algiers
      sideImage1: 'https://res.cloudinary.com/df9dmkiuj/image/upload/v1779484889/7013c9c242c194a7ea9a8970e971adae_q0eeb5.jpg', // Annaba
      sideImage2: 'https://res.cloudinary.com/df9dmkiuj/image/upload/v1779484750/073b82bd6ebe1fe8dac420a01ae6ea01_j2gchb.jpg', // Bejaia
      accent: '#FF7F50',
      bgImage: 'https://res.cloudinary.com/df9dmkiuj/image/upload/v1779481659/5e2ec141a62800034f051de7aab190e3_m4gsyl.jpg', // Casbah
      label1: 'Algiers', label2: 'Annaba', label3: 'Bejaia'
    },
    {
      id: 'mountains',
      category: 'Explore Algeria',
      title: 'Discover the Mountains of Algeria',
      description: "Explore breathtaking peaks, peaceful villages, and unforgettable hiking experiences in Algeria's stunning mountain landscapes.",
      mainImage: 'https://res.cloudinary.com/df9dmkiuj/image/upload/v1779484750/073b82bd6ebe1fe8dac420a01ae6ea01_j2gchb.jpg', // Bejaia
      sideImage1: 'https://images.unsplash.com/photo-1511497584788-8767fe771d50?q=80&w=600',
      sideImage2: 'https://res.cloudinary.com/df9dmkiuj/image/upload/v1779484681/9319eece00c41ac6182fa0d01cb5bd19_hzxzbg.jpg', // Oran
      accent: '#22C55E',
      bgImage: 'https://res.cloudinary.com/df9dmkiuj/image/upload/v1779484750/073b82bd6ebe1fe8dac420a01ae6ea01_j2gchb.jpg', // Bejaia
      label1: 'Bejaia', label2: 'Chelia', label3: 'Oran'
    },
    {
      id: 'desert',
      category: 'Explore Algeria',
      title: 'Discover the Desert of Algeria',
      description: "Experience the magic of the Sahara — vast dunes, silent horizons, and breathtaking sunsets in the world's most iconic desert.",
      mainImage: 'https://res.cloudinary.com/df9dmkiuj/image/upload/v1779485068/ad4a0b5730797c72680d54d720383fc5_wbrgr8.jpg', // Djanet
      sideImage1: 'https://images.unsplash.com/photo-1440635592348-167b1b30296f?q=80&w=600',
      sideImage2: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=600',
      accent: '#EA580C',
      bgImage: 'https://res.cloudinary.com/df9dmkiuj/image/upload/v1779485068/ad4a0b5730797c72680d54d720383fc5_wbrgr8.jpg', // Djanet
      label1: 'Djanet', label2: 'Tamenrast', label3: 'Bechar'
    },
    {
      id: 'history',
      category: 'Explore Algeria',
      title: 'Discover the History of Algeria',
      description: "Discover centuries of history through timeless architecture, ancient cities, and stories carved into every stone.",
      mainImage: 'https://res.cloudinary.com/df9dmkiuj/image/upload/v1779485015/ecaa1f141dcfed8d00c85267cd0b27d5_cyseda.jpg', // Constantine
      sideImage1: 'https://images.unsplash.com/photo-1580674239581-3fbc191a90c2?q=80&w=600',
      sideImage2: 'https://images.unsplash.com/photo-1596395817202-6028590c67e7?q=80&w=600',
      accent: '#92400E',
      bgImage: 'https://res.cloudinary.com/df9dmkiuj/image/upload/v1779485015/ecaa1f141dcfed8d00c85267cd0b27d5_cyseda.jpg', // Constantine
      label1: 'Constantine', label2: 'Timgad', label3: 'Constantine'
    }
  ];

  const themes = defaultThemes.map((defaultSlide) => {
    const apiSlide = heroSlides.find(s => 
      s.theme === defaultSlide.id || 
      (defaultSlide.id === 'beaches' && s.theme === 'coasts')
    );
    if (!apiSlide) return defaultSlide;

    return {
      id: apiSlide.id || defaultSlide.id,
      category: apiSlide.theme || defaultSlide.category,
      title: (apiSlide.full_title || `${apiSlide.title_prefix || ''} ${apiSlide.title_highlight || ''} ${apiSlide.title_suffix || ''}`).trim() || defaultSlide.title,
      description: apiSlide.description || defaultSlide.description,
      // always use our curated local images & labels — remote DB may have stale wilaya assignments
      mainImage: defaultSlide.mainImage,
      sideImage1: defaultSlide.sideImage1,
      sideImage2: defaultSlide.sideImage2,
      accent: apiSlide.highlight_color || defaultSlide.accent,
      bgImage: getImageUrl(apiSlide) && getImageUrl(apiSlide) !== 'https://via.placeholder.com/1200' ? getImageUrl(apiSlide) : defaultSlide.bgImage,
      label1: defaultSlide.label1,
      label2: defaultSlide.label2,
      label3: defaultSlide.label3,
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeTheme = themes[currentIndex];

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? themes.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 500);
    }, 400);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === themes.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 500);
    }, 400);
  };

  const handleHomeSearch = () => {
    if (homeSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(homeSearch)}`);
    }
  };

  const categoriesTabs = ['All', ...categories.map(category => category.name)];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-28 pb-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={activeTheme.bgImage}
            alt={activeTheme.id}
            className={`w-full h-full object-cover transition-all duration-1000 transform scale-105 ${isTransitioning ? 'blur-2xl scale-125 opacity-50' : 'blur-0 scale-105 opacity-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/30 to-transparent"></div>
        </div>

        <div className={`absolute inset-0 z-40 bg-white transition-opacity duration-500 pointer-events-none ${isTransitioning ? 'opacity-20' : 'opacity-0'}`}></div>

        <button
          onClick={handlePrev}
          className="absolute left-10 z-30 p-5 rounded-full border border-white/20 text-white/40 hover:text-white hover:border-white transition-all backdrop-blur-md group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="absolute right-10 z-30 p-5 rounded-full border border-white/20 text-white/40 hover:text-white hover:border-white transition-all backdrop-blur-md group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
          <div className="flex flex-col justify-center min-h-[500px]">
            <div className={`space-y-10 transition-all duration-700 transform ${isTransitioning ? 'opacity-0 -translate-x-12' : 'opacity-100 translate-x-0'}`}>
              <div className="inline-block px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[12px] font-bold text-white uppercase tracking-widest">
                {activeTheme.category}
              </div>
              <h1 className="text-white text-7xl md:text-8xl font-black leading-[1] tracking-tight min-h-[160px]">
                {activeTheme.title.split(' ').slice(0, -2).join(' ')} <br />
                <span className="transition-colors duration-1000" style={{ color: activeTheme.accent }}>{activeTheme.title.split(' ').slice(-2).join(' ')}</span>
              </h1>
              <p className="text-gray-300 text-xl max-w-lg leading-relaxed font-medium min-h-[90px]">
                {activeTheme.description}
              </p>
              <div className="pt-4">
                <button
                  onClick={() => navigate('/wilayas')}
                  className="px-14 py-6 rounded-full font-black flex items-center space-x-5 transition-all transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-orange-500/20"
                  style={{ backgroundColor: activeTheme.accent, color: 'white' }}
                >
                  <span className="text-xl">Explore Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10 justify-end relative h-[650px]">
            <div className="w-[360px] h-[520px] flex-shrink-0">
              <div className={`relative w-full h-full rounded-[50px] overflow-hidden border-[12px] border-white/5 shadow-2xl group transition-all duration-700 transform ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <img src={activeTheme.mainImage} alt="Main" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-12 left-0 right-0 text-center">
                  <h3 className="text-white text-5xl font-black tracking-tighter opacity-50 uppercase">{activeTheme.label1}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-8 flex flex-col flex-shrink-0">
              <div className="w-[300px] h-[200px] flex-shrink-0">
                <div className={`relative w-full h-full rounded-[40px] overflow-hidden border-[6px] border-white/5 shadow-xl group transition-all duration-700 delay-75 transform ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  <img src={activeTheme.sideImage1} alt="Side 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-4xl font-black opacity-30 tracking-tighter uppercase">{activeTheme.label2}</span>
                  </div>
                </div>
              </div>
              <div className="w-[300px] h-[200px] flex-shrink-0">
                <div className={`relative w-full h-full rounded-[40px] overflow-hidden border-[6px] border-white/5 shadow-xl group transition-all duration-700 delay-150 transform ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  <img src={activeTheme.sideImage2} alt="Side 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-4xl font-black opacity-30 tracking-tighter uppercase">{activeTheme.label3}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6">
          {themes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => !isTransitioning && setCurrentIndex(idx)}
              className={`transition-all duration-700 rounded-full ${currentIndex === idx ? 'w-10 h-3 bg-white shadow-xl' : 'w-3 h-3 bg-white/30 hover:bg-white/50'}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Floating Search Widget */}
      <div className="relative z-30 max-w-5xl mx-auto -mt-24 px-6 pb-20">
        <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100">
          <div className="flex items-center space-x-10 mb-8 border-b border-gray-50 pb-4 overflow-x-auto no-scrollbar">
            {categoriesTabs.map((tab, i) => (
              <button
                key={tab}
                className={`text-[13px] font-bold pb-4 whitespace-nowrap transition-all uppercase tracking-wider ${i === 0 ? 'text-[#006699] border-b-2 border-[#006699]' : 'text-gray-300 hover:text-gray-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-8 items-end">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Where to go</label>
              <div className="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006699] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={homeSearch}
                  onChange={(e) => setHomeSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleHomeSearch()}
                  placeholder="Search destinations, cities..."
                  className="w-full bg-[#F8FAFF] rounded-2xl py-5 pl-16 pr-8 text-sm outline-none border border-transparent focus:border-[#006699] focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">When</label>
              <div className="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006699] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <input
                  type="date"
                  className="w-full bg-[#F8FAFF] rounded-2xl py-5 pl-16 pr-8 text-sm outline-none border border-transparent focus:border-[#006699] focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              onClick={handleHomeSearch}
              className="text-white rounded-2xl py-5 px-10 font-bold hover:opacity-90 transition-all shadow-xl shadow-orange-100 flex items-center justify-center space-x-3 transform hover:scale-[1.02]"
              style={{ backgroundColor: activeTheme.accent }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search Destinations</span>
            </button>
          </div>
        </div>
      </div>

      {/* Discover Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-[#0F4C81] text-4xl font-bold mb-4">Discover by Category</h2>
            <p className="text-gray-400 text-lg">Explore the diverse wonders of Algeria</p>
          </div>
          {filteredCards.length > 3 && (
            <div className="flex space-x-4">
              <button
                onClick={handleDiscoverPrev}
                disabled={discoverIndex === 0}
                className={`p-4 rounded-full border border-gray-200 text-gray-400 transition-all ${discoverIndex > 0 ? 'hover:bg-[#006699] hover:text-white hover:border-[#006699] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleDiscoverNext}
                disabled={discoverIndex >= filteredCards.length - 3}
                className={`p-4 rounded-full border border-gray-200 text-gray-400 transition-all ${discoverIndex < filteredCards.length - 3 ? 'hover:bg-[#006699] hover:text-white hover:border-[#006699] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCards.slice(discoverIndex, discoverIndex + 3).map(card => (
              <div key={card.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group relative border border-gray-50 flex flex-col h-full">
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className="text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-opacity-95 shadow-sm"
                    style={{ backgroundColor: activeTheme.accent }}
                  >
                    {card.type === 'Destination' ? 'WILAYA' : activeCategory.toUpperCase()}
                  </span>
                </div>
                <Link to={card.linkTo} className="block flex-1 flex-col">
                  <div className="h-64 overflow-hidden relative">
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-[#0F4C81] text-2xl font-bold mb-4 group-hover:text-[#FF7F50] transition-colors leading-snug">
                      {card.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {card.description}
                    </p>
                    <div className="flex items-center text-sm font-bold mt-auto" style={{ color: activeTheme.accent }}>
                      <span>Learn More</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No locations available under this category.
          </div>
        )}
      </section>

      {/* Hotels Section */}
      {hotels.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-[#0F4C81] text-4xl font-bold mb-4">Hotels & Accommodations</h2>
              <p className="text-gray-400 text-lg">Find the perfect place to stay in Algeria</p>
            </div>
            {hotels.length > 3 && (
              <div className="flex space-x-4">
                <button
                  onClick={handleHotelsPrev}
                  disabled={hotels_index === 0}
                  className={`p-4 rounded-full border border-gray-200 text-gray-400 transition-all ${hotels_index > 0 ? 'hover:bg-[#FF7F50] hover:text-white hover:border-[#FF7F50] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleHotelsNext}
                  disabled={hotels_index >= Math.max(0, hotels.length - 6)}
                  className={`p-4 rounded-full border border-gray-200 text-gray-400 transition-all ${hotels_index < Math.max(0, hotels.length - 6) ? 'hover:bg-[#FF7F50] hover:text-white hover:border-[#FF7F50] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {hotels.slice(hotels_index, hotels_index + 6).map(hotel => (
              <div key={hotel.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group relative border border-gray-50 flex flex-col h-full">
                <div className="absolute top-4 right-4 z-10">
                  <span className="text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FF7F50] shadow-sm">HOTEL</span>
                </div>
                <Link to={hotel.linkTo} className="block flex-1 flex-col">
                  <div className="h-64 overflow-hidden relative">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-[#0F4C81] text-2xl font-bold mb-4 group-hover:text-[#FF7F50] transition-colors leading-snug">{hotel.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">{hotel.description}</p>
                    <div className="flex items-center text-sm font-bold text-[#FF7F50] mt-auto">
                      <span>Learn More</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Restaurants Section */}
      {restaurants.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-[#0F4C81] text-4xl font-bold mb-4">Restaurants & Dining</h2>
              <p className="text-gray-400 text-lg">Discover the flavors of Algeria</p>
            </div>
            {restaurants.length > 3 && (
              <div className="flex space-x-4">
                <button
                  onClick={handleRestaurantsPrev}
                  disabled={restaurants_index === 0}
                  className={`p-4 rounded-full border border-gray-200 text-gray-400 transition-all ${restaurants_index > 0 ? 'hover:bg-[#FF7F50] hover:text-white hover:border-[#FF7F50] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleRestaurantsNext}
                  disabled={restaurants_index >= Math.max(0, restaurants.length - 6)}
                  className={`p-4 rounded-full border border-gray-200 text-gray-400 transition-all ${restaurants_index < Math.max(0, restaurants.length - 6) ? 'hover:bg-[#FF7F50] hover:text-white hover:border-[#FF7F50] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {restaurants.slice(restaurants_index, restaurants_index + 6).map(restaurant => (
              <div key={restaurant.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group relative border border-gray-50 flex flex-col h-full">
                <div className="absolute top-4 right-4 z-10">
                  <span className="text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#FF7F50] shadow-sm">RESTAURANT</span>
                </div>
                <Link to={restaurant.linkTo} className="block flex-1 flex-col">
                  <div className="h-64 overflow-hidden relative">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-[#0F4C81] text-2xl font-bold mb-4 group-hover:text-[#FF7F50] transition-colors leading-snug">{restaurant.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">{restaurant.description}</p>
                    <div className="flex items-center text-sm font-bold text-[#FF7F50] mt-auto">
                      <span>Learn More</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section className="bg-[#FAF7E6] py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-[#0F4C81] text-4xl font-bold mb-4">Upcoming Events in Algeria</h2>
              <p className="text-gray-500 text-lg">Don't miss out on these amazing cultural experiences</p>
            </div>
            {shuffledEvents.length > 3 && (
              <div className="flex space-x-4">
                <button
                  onClick={handleEventPrev}
                  disabled={eventIndex === 0}
                  className={`p-4 rounded-full border border-gray-300 text-gray-400 bg-white transition-all ${eventIndex > 0 ? 'hover:bg-[#006699] hover:text-white hover:border-[#006699] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleEventNext}
                  disabled={eventIndex >= shuffledEvents.length - 3}
                  className={`p-4 rounded-full border border-gray-300 text-gray-400 bg-white transition-all ${eventIndex < shuffledEvents.length - 3 ? 'hover:bg-[#006699] hover:text-white hover:border-[#006699] cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {shuffledEvents.slice(eventIndex, eventIndex + 3).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {shuffledEvents.slice(eventIndex, eventIndex + 3).map(event => {
                const eventImage = getImageUrl(event);
                const eventDate = event.period || event.date_range || 'Upcoming';
                const eventLocation = event.location || event.wilaya_name || 'Algeria';
                const detailLink = `/details/event-${event.id}`;
                return (
                  <div key={event.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group relative border border-gray-100 flex flex-col h-full">
                    <Link to={detailLink} className="block flex-1 flex-col">
                      <div className="h-64 overflow-hidden relative">
                        <img src={eventImage} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <h3 className="text-[#0F4C81] text-2xl font-bold mb-5 group-hover:text-[#FF7F50] transition-colors leading-snug">{event.name}</h3>
                        <div className="space-y-3 mt-auto">
                          <div className="flex items-center text-gray-500 text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{eventDate}</span>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{eventLocation}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white/50 rounded-[32px] p-8">
              No upcoming events listed at this moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;