// Updated: 2026-05-08 10:18
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PlaceCard from '../components/PlaceCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved);
  };

  useEffect(() => {
    loadFavorites();
    
    // Listen for updates from other components
    const handleUpdate = () => loadFavorites();
    window.addEventListener('favoritesUpdated', handleUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleUpdate);
  }, []);

  const handleRemove = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const filteredFavorites = useMemo(() => {
    if (activeFilter === 'All') return favorites;
    return favorites.filter(item => {
      if (activeFilter === 'Hotels') return item.type === 'Hotel';
      if (activeFilter === 'Landmarks') return item.type === 'Landmark';
      if (activeFilter === 'Restaurants') return item.type === 'Restaurant';
      return true;
    });
  }, [favorites, activeFilter]);

  const filters = ['All', 'Landmarks', 'Hotels', 'Restaurants'];

  return (
    <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <h1 className="text-[#0F4C81] text-5xl font-extrabold tracking-tight">My Favorite Places</h1>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            Your curated collection of breathtaking spots across Algeria. From the coastal breezes 
            of the Mediterranean to the golden dunes of the Sahara.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-4 mb-12 overflow-x-auto no-scrollbar py-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                activeFilter === filter 
                  ? 'bg-[#006699] text-white shadow-lg shadow-blue-100' 
                  : 'bg-[#E9E4D4] text-gray-600 hover:bg-[#DDD8C8]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredFavorites.map(item => (
              <PlaceCard key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-24 text-center shadow-sm border border-gray-100">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-[#0F4C81] text-2xl font-bold mb-4">No favorites yet</h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-10">
              Explore Algeria and start saving your favorite destinations to see them here!
            </p>
            <Link to="/search" className="bg-[#006699] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#004d73] transition-all shadow-xl shadow-blue-100">
              Discover Places
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
