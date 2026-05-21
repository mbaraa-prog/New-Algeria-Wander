import React from 'react';
import { Link } from 'react-router-dom';
import { wilayas } from '../data/mockData';

const WilayaCard = ({ wilaya }) => {
  // Determine tag color based on category
  const getTagStyle = (tag) => {
    if (tag.includes('SAHARA')) return 'bg-[#91470A]';
    if (tag.includes('COAST') || tag.includes('VIBES')) return 'bg-[#006699]';
    if (tag.includes('HISTORY')) return 'bg-[#4B5563]';
    if (tag.includes('LUSH')) return 'bg-[#059669]';
    if (tag.includes('OASIS')) return 'bg-[#B45309]';
    return 'bg-gray-600';
  };

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col h-full border border-gray-50">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={wilaya.image} 
          alt={wilaya.name} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
        />
        <div className="absolute top-4 left-4">
          <span className={`${getTagStyle(wilaya.tag)} text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm bg-opacity-90`}>
            {wilaya.tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-10 flex flex-col flex-1">
        <h2 className="text-[#0F4C81] text-3xl font-bold mb-5">{wilaya.name}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
          {wilaya.description}
        </p>
        <Link 
          to={`/wilaya/${wilaya.id}`}
          className={`w-full ${getTagStyle(wilaya.tag)} text-white py-4 rounded-2xl font-bold text-center hover:opacity-90 transition-all shadow-lg shadow-gray-200`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const Wilayas = () => {
  return (
    <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h1 className="text-[#0F4C81] text-5xl font-extrabold tracking-tight">
            Explore Algeria by Wilaya
          </h1>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            Discover the rich diversity of Algeria, from the sparkling Mediterranean coastline to the 
            endless dunes of the Sahara. Select a wilaya to begin your adventure.
          </p>
        </div>

        {/* Wilayas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {wilayas.map((wilaya) => (
            <WilayaCard key={wilaya.id} wilaya={wilaya} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wilayas;
