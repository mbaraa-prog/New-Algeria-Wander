import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PlaceCard from '../components/PlaceCard';
import dataService from '../api/data';
import { getImageUrl } from '../config/api';

// Helper function to normalize strings for case-insensitive and accent-insensitive search
const normalizeString = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritical marks
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';

  const [places, setPlaces] = useState([]);
  const [wilayaOptions, setWilayaOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedWilayas, setSelectedWilayas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  // Read filter params from URL (e.g. when coming from WilayaDetails)
  useEffect(() => {
    const cat = searchParams.get('category');
    const wilaya = searchParams.get('wilaya');
    if (cat) setSelectedCategory(cat);
    if (wilaya) setSelectedWilayas([wilaya]);
    setVisibleCount(12); // reset on URL change
  }, [searchParams]);

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const [placesResponse, wilayasResponse] = await Promise.all([
          dataService.getPlaces(),
          dataService.getWilayas(),
        ]);

        let p = placesResponse ?? [];
        if (p.results) p = p.results;
        else if (p.data) p = p.data;
        setPlaces(Array.isArray(p) ? p : []);

        let w = wilayasResponse ?? [];
        if (w.results) w = w.results;
        else if (w.data) w = w.data;
        setWilayaOptions(Array.isArray(w) ? w : []);
      } catch (error) {
        console.error('Failed to load search data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchData();
  }, []);

  const allItems = useMemo(
    () => places.map(place => ({
      ...place,
      image: getImageUrl(place),
      description: place.short_desc || place.description,
      type: place.place_type_display || place.place_type || 'Place',
      wilaya: place.wilaya_name,
      linkTo: `/details/${place.id}`,
    })),
    [places]
  );

  const matchesCategory = (itemType, selectedCategory) => {
    if (selectedCategory === 'All') return true;
    const t = (itemType || '').toLowerCase();
    if (selectedCategory === 'Hotels')
      return t.includes('hotel') || t.includes('accommodation') || t.includes('stay') || t.includes('lodge') || t.includes('inn');
    if (selectedCategory === 'Restaurants')
      return t.includes('restaurant') || t.includes('dining') || t.includes('food') || t.includes('cafe') || t.includes('eatery');
    if (selectedCategory === 'Landmarks')
      return t.includes('landmark') || t.includes('attraction') || t.includes('historic') || t.includes('museum') || t.includes('monument') || t.includes('park') || t.includes('site') || t.includes('place');
    return true;
  };

  const filteredResults = useMemo(() => {
    const normalizedQuery = normalizeString(queryFromUrl);
    return allItems.filter(item => {
      const matchesQuery = !normalizedQuery ||
        normalizeString(item.name).includes(normalizedQuery) ||
        normalizeString(item.wilaya).includes(normalizedQuery) ||
        normalizeString(item.description).includes(normalizedQuery);

      const matchesCat = matchesCategory(item.type, selectedCategory);

      const matchesWilaya = selectedWilayas.length === 0 ||
        selectedWilayas.includes(item.wilaya);

      return matchesQuery && matchesCat && matchesWilaya;
    });
  }, [allItems, queryFromUrl, selectedCategory, selectedWilayas]);

  const toggleWilaya = (wilayaName) => {
    setSelectedWilayas(prev =>
      prev.includes(wilayaName)
        ? prev.filter(w => w !== wilayaName)
        : [...prev, wilayaName]
    );
    setVisibleCount(12); // reset on filter change
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(12);
  };

  return (
    <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

        {/* Sidebar Filters */}
        <aside className="space-y-10">
          <h2 className="text-[#0F4C81] text-2xl font-bold px-2">Filters</h2>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-10">
            {/* Category Filter */}
            <div className="space-y-6">
              <h3 className="text-[#0F4C81] text-sm font-bold uppercase tracking-widest">Category</h3>
              <div className="space-y-4">
                {['All', 'Hotels', 'Restaurants', 'Landmarks'].map(cat => (
                  <label key={cat} className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => handleCategoryChange(cat)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedCategory === cat ? 'border-[#006699]' : 'border-gray-200 group-hover:border-gray-300'
                      }`}>
                      {selectedCategory === cat && <div className="w-2.5 h-2.5 rounded-full bg-[#006699]" />}
                    </div>
                    <span className={`ml-4 text-sm font-medium transition-colors ${selectedCategory === cat ? 'text-[#0F4C81]' : 'text-gray-500'
                      }`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Wilaya Filter */}
            <div className="space-y-6">
              <h3 className="text-[#0F4C81] text-sm font-bold uppercase tracking-widest">Wilayas</h3>
              <div className="space-y-4">
                {wilayaOptions.slice(0, 5).map(wilaya => (
                  <label key={wilaya.id} className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedWilayas.includes(wilaya.name)}
                      onChange={() => toggleWilaya(wilaya.name)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${selectedWilayas.includes(wilaya.name) ? 'bg-[#006699] border-[#006699]' : 'bg-white border-gray-200 group-hover:border-gray-300'
                      }`}>
                      {selectedWilayas.includes(wilaya.name) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`ml-4 text-sm font-medium transition-colors ${selectedWilayas.includes(wilaya.name) ? 'text-[#0F4C81]' : 'text-gray-500'
                      }`}>{wilaya.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content: Results */}
        <main className="space-y-10">
          <div className="space-y-2">
            <h1 className="text-[#0F4C81] text-4xl font-bold">
              {queryFromUrl ? `Search Results for "${queryFromUrl}"` : 'Search All Destinations'}
            </h1>
            <p className="text-gray-400 font-medium">
              {isLoading
                ? 'Loading search results...'
                : `Showing ${Math.min(visibleCount, filteredResults.length)} of ${filteredResults.length} result${filteredResults.length !== 1 ? 's' : ''} matching your criteria.`}
            </p>
          </div>

          {isLoading ? (
            <div className="min-h-[300px] flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-[#006699] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredResults.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredResults.slice(0, visibleCount).map(item => (
                  <PlaceCard key={item.id} item={item} />
                ))}
              </div>
              {filteredResults.length > visibleCount && !isLoading && (
                <div className="flex justify-center pt-10">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="px-10 py-3.5 rounded-full border-2 border-[#006699] text-[#006699] font-bold hover:bg-[#006699] hover:text-white transition-all"
                  >
                    Load More Results ({filteredResults.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-[#0F4C81] text-xl font-bold mb-2">No results found</h3>
              <p className="text-gray-400">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;