import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../config/api';

const PlaceCard = ({ item, type = 'default', onRemove, linkTo }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const cardLink = linkTo || `/details/${item.id}`;
  const image = getImageUrl(item);
  console.log("PlaceCard Image URL:", image);
  const description = item.description || item.short_desc || item.body || item?.short_desc || '';
  const typeLabel = item.type || item.place_type_display || item.place_type || item.date_range || 'Explore';
  const location = item.location || item.wilaya || item.wilaya_name || '';
  const date = item.date || item.date_range || '';

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some(fav => fav.id === item.id));
  }, [item.id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== item.id);
      if (onRemove) onRemove(item.id);
    } else {
      updatedFavorites = [...favorites, item];
    }
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    
    // Dispatch custom event to notify other components (like Favorites page)
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  if (type === 'event') {
    return (
      <Link to={cardLink} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 block group relative">
        <button 
          onClick={toggleFavorite}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:scale-110 transition-all duration-300 group/heart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover/heart:text-red-400'}`} viewBox="0 0 24 24" stroke="currentColor" fill={isFavorite ? 'currentColor' : 'none'}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <div className="h-48 overflow-hidden">
          <img src={image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="p-6">
          <h3 className="text-[#0F4C81] text-lg font-bold mb-3 group-hover:text-[#FF7F50] transition-colors">{item.name}</h3>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {date}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
          {onRemove && (
            <button 
              onClick={toggleFavorite}
              className="w-full mt-6 py-3 border border-gray-100 rounded-2xl text-xs font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Remove</span>
            </button>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group relative">
      <button 
        onClick={toggleFavorite}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:scale-110 transition-all duration-300 group/heart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover/heart:text-red-400'}`} viewBox="0 0 24 24" stroke="currentColor" fill={isFavorite ? 'currentColor' : 'none'}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
      
      <Link to={cardLink} className="block">
        <div className="h-48 overflow-hidden">
          <img src={image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#FF7F50] text-xs font-bold uppercase tracking-wider">{typeLabel}</span>
            <div className="flex items-center text-gray-500 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {item.rating}
            </div>
          </div>
          <h3 className="text-[#0F4C81] text-lg font-bold mb-2 group-hover:text-[#FF7F50] transition-colors">{item.name}</h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-4">{description}</p>
          
          {onRemove ? (
            <button 
              onClick={toggleFavorite}
              className="w-full mt-2 py-3 border border-gray-100 rounded-2xl text-xs font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Remove</span>
            </button>
          ) : (
            <div className="flex items-center text-gray-400 text-xs mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PlaceCard;
