import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dataService from '../api/data';
import BlogCard from '../components/BlogCard';

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (params = {}) => {
    try {
      setLoading(true);
      const response = await dataService.getBlogs(params);
      setBlogs(response.results || response);
      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 space-y-6 md:space-y-0">
          <h1 className="text-[#0F4C81] text-5xl font-extrabold tracking-tight">Traveler Stories</h1>
          <Link
            to="/blogs/new"
            className="bg-[#006699] text-white px-8 py-3.5 rounded-2xl font-bold flex items-center space-x-3 hover:bg-[#004d73] transition-all shadow-xl shadow-blue-100 self-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Blog</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
          {/* Main Content: Blog List */}
          <main className="space-y-10">
            {loading && <div className="text-center py-12 text-gray-500">Loading blogs...</div>}
            {error && <div className="text-center py-12 text-red-500">{error}</div>}
            {!loading && blogs.length === 0 && <div className="text-center py-12 text-gray-500">No blogs yet</div>}

            {!loading && (showAll ? blogs : blogs.slice(0, 6)).map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}

            {/* Pagination / Load More */}
            {!loading && blogs.length > 6 && !showAll && (
              <div className="flex justify-center pt-10">
                <button onClick={() => setShowAll(true)} className="px-10 py-4 rounded-full border-2 border-[#006699] text-[#006699] font-bold hover:bg-[#006699] hover:text-white transition-all">
                  View All Stories
                </button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-12">
            {/* Community Stats */}
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50">
              <h3 className="text-[#0F4C81] text-2xl font-bold mb-8">
                Community Stats
              </h3>

              <div className="space-y-5">
                <div className="flex items-center justify-between bg-[#EEF4FF] rounded-2xl px-5 py-4">
                  <span className="font-semibold text-[#0F4C81]">
                    📝 Total Blogs
                  </span>
                  <span className="font-bold text-[#006699] text-lg">
                    {blogs.length}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-[#EEF4FF] rounded-2xl px-5 py-4">
                  <span className="font-semibold text-[#0F4C81]">
                    ✍️ Stories Displayed
                  </span>
                  <span className="font-bold text-[#006699] text-lg">
                    {showAll ? blogs.length : Math.min(6, blogs.length)}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-[#EEF4FF] rounded-2xl px-5 py-4">
                  <span className="font-semibold text-[#0F4C81]">
                    👥 Contributors
                  </span>
                  <span className="font-bold text-[#006699] text-lg">
                    {new Set(
                      blogs.map(blog => blog.author?.username || blog.author_name)
                    ).size}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-[#EEF4FF] rounded-2xl px-5 py-4">
                  <span className="font-semibold text-[#0F4C81]">
                    🌍 Travel Community
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Community CTA */}
            <div className="bg-[#E9E4D4] rounded-[40px] p-10 shadow-sm relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <h3 className="text-[#0F4C81] text-2xl font-bold">Join the Community</h3>
                <p className="text-gray-600 text-[15px] font-medium leading-relaxed">
                  Share your unique Algerian journey with thousands of travelers.
                </p>
                <button onClick={() => navigate('/blogs/new')} className="w-full bg-[#91470A] text-white py-4 rounded-2xl font-bold hover:bg-[#7a3c08] transition-all shadow-xl shadow-orange-900/10">
                  Start Writing
                </button>
              </div>
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all"></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
