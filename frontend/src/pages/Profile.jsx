import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBackendAssetUrl, getMediaUrl, getImageUrl } from '../config/api';
import authService from '../api/auth';
import dataService from '../api/data';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [favorites, setFavorites] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch profile
        const response = await authService.getProfile();
        let currentUser = user;
        if (response.success) {
          setProfile(response.data.user);
          currentUser = response.data.user;
        }

        // Fetch blogs and filter by current user
        const blogsResponse = await dataService.getBlogs();
        const blogsList = blogsResponse.results || blogsResponse || [];
        const userBlogs = blogsList.filter(blog =>
          blog.author?.username === currentUser?.username ||
          blog.author?.id === currentUser?.id ||
          blog.author === currentUser?.username
        );
        setMyBlogs(userBlogs);

        // Load favorites from localStorage (same source as PlaceCard)
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);

        // Fetch comments from blogs
        const userComments = blogsList
          .flatMap(blog => blog.comments || [])
          .filter(comment =>
            comment.author?.username === currentUser?.username ||
            comment.author?.id === currentUser?.id
          );
        setComments(userComments);

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();

    // Keep favorites in sync if updated from another tab/component
    const handleFavUpdate = () => {
      const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(saved);
    };
    window.addEventListener('favoritesUpdated', handleFavUpdate);
    return () => window.removeEventListener('favoritesUpdated', handleFavUpdate);
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
                  src={profile?.avatar
                    ? getBackendAssetUrl(profile.avatar)
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || profile?.username || 'U')}&background=006699&color=fff&size=200`}
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
                {profile?.bio && <p className="text-gray-500 max-w-md mt-4 italic">"{profile.bio}"</p>}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="bg-[#4B5563] text-white px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Explorer</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <Link to="/profile/edit" className="bg-white border-2 border-gray-100 text-gray-500 px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Account Settings</span>
            </Link>
            <button onClick={handleLogout} className="bg-red-50 text-red-500 px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-100 transition-all shadow-sm">
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
                <Link to="/favorites" className="text-[#006699] text-sm font-bold hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {favorites.length === 0 ? (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-gray-400 font-medium">No favorites yet</p>
                    <Link to="/search" className="text-[#006699] text-sm font-bold mt-2 inline-block hover:underline">
                      Discover places
                    </Link>
                  </div>
                ) : (
                  favorites.slice(0, 9).map(item => (
                    <Link
                      key={item.id}
                      to={item.linkTo || `/details/${item.id}`}
                      className="relative group rounded-3xl overflow-hidden shadow-sm h-64 border border-gray-50 block"
                    >
                      <img
                        src={getImageUrl(item)}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h4 className="text-white font-bold mb-1 truncate">{item.name}</h4>
                        {item.location && (
                          <p className="text-white/60 text-xs truncate">{item.location}</p>
                        )}
                      </div>
                    </Link>
                  ))
                )}
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
                {comments.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-400 font-medium">No comments yet</p>
                  </div>
                ) : (
                  comments.map((comment, index) => (
                    <div key={comment.id || index} className="p-6 bg-[#F8FAFF] rounded-3xl space-y-3">
                      <p className="text-gray-500 text-sm leading-relaxed italic">"{comment.content}"</p>
                    </div>
                  ))
                )}
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
                {myBlogs.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-400 font-medium">No blogs yet</p>
                  </div>
                ) : (
                  myBlogs.map(blog => {
                    const coverImage = getImageUrl(blog);
                    return (
                      <div key={blog.id} className="flex items-center gap-6 group cursor-pointer" onClick={() => navigate(`/blogs/${blog.id}`)}>
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                          <img src={coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[#0F4C81] text-sm font-bold leading-tight group-hover:text-[#006699] transition-colors">{blog.title}</h4>
                          <span className="text-gray-400 text-[10px] font-medium">{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : ''}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;