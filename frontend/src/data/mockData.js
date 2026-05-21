export const wilayas = [
  { 
    id: 1, 
    name: 'Algiers', 
    tag: 'CAPITAL CITY', 
    description: 'Known as "Algiers the White" for its stunning whitewashed buildings cascading down to the Mediterranean Sea. A vibrant blend of ancient Casbah history and modern coastal life.',
    image: 'https://images.unsplash.com/photo-1596395817202-6028590c67e7?q=80&w=1600' 
  },
  { 
    id: 2, 
    name: 'Oran', 
    tag: 'COASTAL VIBES', 
    description: 'The vibrant second city. Known for its lively atmosphere, Spanish-influenced architecture, and the iconic Santa Cruz fort perched high above the sea.',
    image: 'https://images.unsplash.com/photo-1623159333555-d4508493010b?q=80&w=1600' 
  },
  { 
    id: 6, 
    name: 'Djanet', 
    tag: 'DEEP SAHARA', 
    description: 'The heart of the deep south. Explore the otherworldly landscapes of the Hoggar Mountains and experience authentic Tuareg culture amidst towering peaks.',
    image: 'https://images.unsplash.com/photo-1605330368140-5a3d4638a1f8?q=80&w=1600' 
  },
  { 
    id: 5, 
    name: 'Constantine', 
    tag: 'HISTORY & VIEWS', 
    description: 'The City of Bridges. Perched dramatically on cliffs above a deep gorge, offering breathtaking vistas and a profound sense of history.',
    image: 'https://images.unsplash.com/photo-1601659103998-bc4696081be7?q=80&w=1600' 
  },
  { 
    id: 3, 
    name: 'Bejaia', 
    tag: 'LUSH COAST', 
    description: 'The coastal gem of the east. Discover beautiful beaches, lush green mountains, and the striking Basilica of St Augustine overlooking the sea.',
    image: 'https://images.unsplash.com/photo-1615822365287-6396443c7270?q=80&w=1600' 
  },
  { 
    id: 4, 
    name: 'Annaba', 
    tag: 'OASIS HERITAGE', 
    description: 'The jewel of the M\'Zab Valley. Marvel at the unique, ancient urban planning and the distinctive pastel-colored architecture of this UNESCO World Heritage site.',
    image: 'https://images.unsplash.com/photo-1625232906354-946279f5383a?q=80&w=1600' 
  },
];

export const featuredPlaces = [
  // Algiers Stays
  {
    id: 10,
    name: 'El Aurassi Hotel',
    type: 'Hotel',
    category: 'Stays',
    wilaya: 'Algiers',
    description: 'Iconic luxury overlooking the Bay of Algiers, featuring premium amenities and Mediterranean views.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200',
    rating: 5.0,
    price: '$250/night',
    isTopPick: true
  },
  {
    id: 11,
    name: 'Sofitel Algiers',
    type: 'Hotel',
    category: 'Stays',
    wilaya: 'Algiers',
    description: 'Modern luxury near the botanical gardens with exceptional dining.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800',
    rating: 4.8,
    price: '$200/night'
  },
  {
    id: 12,
    name: 'Dar El Kebira',
    type: 'Hotel',
    category: 'Stays',
    wilaya: 'Algiers',
    description: 'A beautifully restored traditional house in the heart of the historic Casbah.',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800',
    rating: 4.9,
    price: '$150/night'
  },
  {
    id: 13,
    name: 'Ruins of Djemila',
    type: 'Landmark',
    category: 'History',
    wilaya: 'Sétif',
    description: 'Breathtaking Roman ruins in the mountains of Sétif.',
    image: 'https://images.unsplash.com/photo-1590418606746-018840fb9cd0?q=80&w=800',
    rating: 4.9
  },
  {
    id: 6,
    name: 'Marriott Bab Ezzouar',
    type: 'Hotel',
    category: 'Stays',
    wilaya: 'Algiers',
    description: 'Contemporary comfort conveniently located near the airport and business district.',
    image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=800',
    rating: 4.6,
    price: '$180/night'
  },
];

export const upcomingEvents = [
  {
    id: 'e1',
    name: 'Algiers Jazz Nights',
    type: 'Event',
    wilaya: 'Algiers',
    date: 'August 10-12, 2026',
    location: 'Palais de la Culture, Algiers',
    description: 'A soulful evening of jazz under the stars at the majestic Palace of Culture.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200',
    rating: 4.9
  },
];

export const userActivity = {
  comments: [
    { id: 1, title: 'Guide to Oran', date: '2 days ago', content: 'Absolutely loved the recommendations for seafood restaurants near the port! The view was spectacular.' },
    { id: 2, title: 'Sahara Packing List', date: '1 week ago', content: 'This was so helpful. Don\'t forget to emphasize bringing plenty of water and a good scarf for the sand.' }
  ],
  myBlogs: [
    { id: 101, title: 'A Weekend in Timimoun', date: 'Published Oct 12', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=200' },
    { id: 102, title: 'Hidden Beaches of Bejaia', date: 'Draft', readTime: 'Last edited yesterday', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200' }
  ]
};
