import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import dataService from '../api/data';
import { marked } from 'marked';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await dataService.getBlogDetail(id);
        setBlog(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog. It may have been removed or does not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const getCoverUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000/media/${path.replace(/^\/+/, '')}`;
  };

  if (loading) {
    return (
      <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center py-24">
          <div className="inline-block w-10 h-10 border-4 border-[#006699] border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-gray-400 text-lg font-medium">Loading article…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center py-24 space-y-6">
          <div className="bg-red-50 text-red-600 inline-block p-4 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-500 text-lg font-semibold">{error}</p>
          <Link to="/blogs" className="inline-block text-[#006699] font-bold hover:underline">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/blogs"
          className="inline-flex items-center space-x-2 text-[#006699] font-bold text-sm mb-10 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Stories</span>
        </Link>

        {getCoverUrl(blog.cover_image) && (
          <div className="rounded-[32px] overflow-hidden mb-12 shadow-lg">
            <img
              src={getCoverUrl(blog.cover_image)}
              alt={blog.title}
              className="w-full h-[420px] object-cover"
            />
          </div>
        )}

        <h1 className="text-[#0F4C81] text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
          {blog.title}
        </h1>

        <div className="flex items-center space-x-4 mb-12 pb-8 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
            <img src="https://i.pravatar.cc/150?u=default" alt={blog.author || 'Author'} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[#0F4C81] text-sm font-bold">{blog.author || 'Anonymous'}</p>
            {blog.created_at && (
              <p className="text-gray-400 text-xs font-medium">
                {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        <article
          style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.8', fontWeight: '500' }}
          dangerouslySetInnerHTML={{ __html: marked.parse(blog.content || '').replace(/<strong>/g, '<strong style="font-weight:800;color:#0F4C81">').replace(/<em>/g, '<em style="font-style:italic;color:#006699">') }}
        />
      </div>
    </div>
  );
};

export default BlogDetail;