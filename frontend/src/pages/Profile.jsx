import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../api/auth';
import { userActivity, featuredPlaces } from '../data/mockData';
import PlaceCard from '../components/PlaceCard';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success) {
          setProfile(response.data.user);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();

    // Load favorites
    const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (savedFavs.length === 0) {
      setFavorites(featuredPlaces.slice(0, 3));
    } else {
      setFavorites(savedFavs);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-16 h-16 border-4 border-[#006699] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }


  return (
    <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* User Header Section */}
        <section className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-50 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-[#F8FAFF] shadow-lg">
                <img 
                  src={profile?.avatar || "https://i.pravatar.cc/150?u=algeria-wander"} 
                  alt={profile?.full_name || profile?.username || 'User'} 
                  className="w-full h-full object-cover"
                />
              </div>
              <Link to="/profile/edit" className="absolute bottom-2 right-2 bg-[#006699] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all border-4 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Link>
            </div>
            
            <div className="text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h1 className="text-[#0F4C81] text-5xl font-extrabold tracking-tight">{profile?.full_name || profile?.username || 'Traveler'}</h1>
                <p className="text-gray-400 font-medium">{profile?.email}</p>
                {profile?.bio && (
                  <p className="text-gray-500 max-w-md mt-4 italic">
                    "{profile.bio}"
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="bg-[#4B5563] text-white px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Explorer</span>
                <span className="bg-[#EEF4FF] text-[#006699] px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Joined 2023</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <Link 
              to="/profile/edit"
              className="bg-white border-2 border-gray-100 text-gray-500 px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Account Settings</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-500 px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-100 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
          {/* Left Column: Favorites */}
          <main className="space-y-12">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="bg-[#EEF4FF] p-3 rounded-2xl text-[#006699]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                   </div>
                   <h2 className="text-[#0F4C81] text-3xl font-bold">My Favorites</h2>
                </div>
                <Link to="/favorites" className="text-[#006699] font-bold text-sm flex items-center gap-2 hover:underline">
                  <span>View All</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {favorites.slice(0, 3).map(item => (
                  <div key={item.id} className="relative group rounded-3xl overflow-hidden shadow-sm h-64 border border-gray-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white shadow-sm hover:bg-white hover:text-red-500 transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="text-white font-bold mb-1 truncate">{item.name}</h4>
                      <p className="text-white/70 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {item.wilaya}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Right Column: Activity Sidebar */}
          <aside className="space-y-12">
            
            {/* Recent Comments */}
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 space-y-8">
              <div className="flex items-center gap-4">
                 <div className="bg-[#EEF4FF] p-3 rounded-2xl text-[#006699]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                 </div>
                 <h2 className="text-[#0F4C81] text-2xl font-bold">Recent Comments</h2>
              </div>

              <div className="space-y-6">
                {userActivity.comments.map(comment => (
                  <div key={comment.id} className="p-6 bg-[#F8FAFF] rounded-3xl space-y-3 hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[#006699] text-xs font-bold uppercase tracking-wider">{comment.title}</h4>
                      <span className="text-gray-400 text-[10px] font-bold">{comment.date}</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed italic">
                      "{comment.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* My Blogs Section */}
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="bg-[#EEF4FF] p-3 rounded-2xl text-[#006699]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l2 2h3a2 2 0 012 2v10a2 2 0 01-2 2z" />
                      </svg>
                   </div>
                   <h2 className="text-[#0F4C81] text-2xl font-bold">My Blogs</h2>
                </div>
                <Link to="/blogs/new" className="bg-[#EEF4FF] text-[#006699] p-2 rounded-lg hover:bg-[#006699] hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </Link>
              </div>

              <div className="space-y-6">
                {userActivity.myBlogs.map(blog => (
                  <div key={blog.id} className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-[#0F4C81] text-sm font-bold leading-tight group-hover:text-[#006699] transition-colors">{blog.title}</h4>
                      <div className="flex items-center gap-3 text-gray-400 text-[10px] font-medium">
                        <span>{blog.date}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{blog.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
