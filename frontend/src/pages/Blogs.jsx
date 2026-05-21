import React from 'react';
import { Link } from 'react-router-dom';
import { blogs, trendingTopics } from '../data/blogData';
import BlogCard from '../components/BlogCard';

const Blogs = () => {
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
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
            
            {/* Pagination / Load More */}
            <div className="flex justify-center pt-10">
               <button className="px-10 py-4 rounded-full border-2 border-[#006699] text-[#006699] font-bold hover:bg-[#006699] hover:text-white transition-all">
                 View All Stories
               </button>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-12">
            {/* Trending Topics */}
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50">
              <h3 className="text-[#0F4C81] text-2xl font-bold mb-8">Trending Topics</h3>
              <div className="flex flex-wrap gap-3">
                {trendingTopics.map(topic => (
                  <button 
                    key={topic} 
                    className="bg-[#EEF4FF] text-[#0F4C81] px-6 py-2.5 rounded-full text-[13px] font-bold hover:bg-[#006699] hover:text-white transition-all"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Community CTA */}
            <div className="bg-[#E9E4D4] rounded-[40px] p-10 shadow-sm relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <h3 className="text-[#0F4C81] text-2xl font-bold">Join the Community</h3>
                <p className="text-gray-600 text-[15px] font-medium leading-relaxed">
                  Share your unique Algerian journey with thousands of travelers.
                </p>
                <button className="w-full bg-[#91470A] text-white py-4 rounded-2xl font-bold hover:bg-[#7a3c08] transition-all shadow-xl shadow-orange-900/10">
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
