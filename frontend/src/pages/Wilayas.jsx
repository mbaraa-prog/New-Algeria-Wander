import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dataService from '../api/data';

const WilayaCard = ({ wilaya }) => {
  const getTagStyle = (tag = '') => {
    if (tag.includes('SAHARA')) return 'bg-[#91470A]';
    if (tag.includes('COAST') || tag.includes('VIBES')) return 'bg-[#006699]';
    if (tag.includes('HISTORY')) return 'bg-[#4B5563]';
    if (tag.includes('LUSH')) return 'bg-[#059669]';
    if (tag.includes('OASIS')) return 'bg-[#B45309]';
    return 'bg-gray-600';
  };

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full border border-gray-50">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={wilaya.cover_image || wilaya.image} 
          alt={wilaya.name} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
        />
        <div className="absolute top-4 left-4">
          <span className={`${getTagStyle(wilaya.category?.name || wilaya.tag || '')} text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm bg-opacity-90`}>
            {wilaya.category?.name || wilaya.tag || 'Destination'}
          </span>
        </div>
      </div>

      <div className="p-10 flex flex-col flex-1">
        <h2 className="text-[#0F4C81] text-3xl font-bold mb-5">{wilaya.name}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
          {wilaya.short_desc || wilaya.description}
        </p>
        <Link 
          to={`/wilaya/${wilaya.id}`}
          className={`w-full ${getTagStyle(wilaya.category?.name || wilaya.tag || '')} text-white py-4 rounded-2xl font-bold text-center hover:opacity-90 transition-all shadow-lg shadow-gray-200`}>
          View Details
        </Link>
      </div>
    </div>
  );
};

const Wilayas = () => {
  const [wilayas, setWilayas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWilayas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await dataService.getWilayas();

        // dataService may return an array, or an object with `results` or `data` keys.
        const payload = response ?? [];
        let items = [];

        if (Array.isArray(payload)) {
          items = payload;
        } else if (Array.isArray(payload.results)) {
          items = payload.results;
        } else if (Array.isArray(payload.data)) {
          items = payload.data;
        } else {
          // try to extract first array-like value
          items = [];
        }

        setWilayas(items);
      } catch (err) {
        console.error('Failed to load wilayas:', err);
        setError('Failed to load wilayas. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWilayas();
  }, []);

  return (
    <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h1 className="text-[#0F4C81] text-5xl font-extrabold tracking-tight">
            Explore Algeria by Wilaya
          </h1>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            Discover the rich diversity of Algeria, from the sparkling Mediterranean coastline to the 
            endless dunes of the Sahara. Select a wilaya to begin your adventure.
          </p>
        </div>

        {isLoading ? (
          <div className="min-h-[320px] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#006699] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="min-h-[240px] flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <p className="text-gray-600 mb-4">{error}</p>
              <button onClick={() => { setIsLoading(true); setError(null); setWilayas([]); window.location.reload(); }} className="bg-[#006699] text-white px-6 py-3 rounded-lg font-bold">Retry</button>
            </div>
          </div>
        ) : (
          (Array.isArray(wilayas) && wilayas.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {wilayas.map((wilaya) => (
                <WilayaCard key={wilaya.id} wilaya={wilaya} />
              ))}
            </div>
          ) : (
            <div className="min-h-[240px] flex items-center justify-center">
              <div className="text-center text-gray-500">No wilayas found.</div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Wilayas;
