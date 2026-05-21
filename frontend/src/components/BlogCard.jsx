import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-50 flex flex-col md:flex-row group h-full md:h-72">
      {/* Image Section */}
      <div className="md:w-2/5 relative h-64 md:h-full overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-6 left-6">
          <span className="bg-white/90 backdrop-blur-md text-[#0F4C81] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
            {blog.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="text-[#0F4C81] text-2xl font-bold leading-tight group-hover:text-[#FF7F50] transition-colors">
            {blog.title}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
            {blog.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 shadow-sm">
              <img src={blog.author.avatar} alt={blog.author.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[#0F4C81] text-[13px] font-bold">{blog.author.name}</span>
          </div>
          
          <Link 
            to={`/blog/${blog.id}`}
            className="text-[#FF7F50] text-[13px] font-bold flex items-center space-x-1 group/link"
          >
            <span>Read more</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
