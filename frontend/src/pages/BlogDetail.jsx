import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dataService from '../api/data';
import { getBackendAssetUrl, getMediaUrl } from '../config/api';
import * as markedModule from 'marked';
const marked = markedModule.marked;

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);

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

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setCommentError('You must be logged in to comment.');
      return;
    }
    if (!commentContent.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError(null);
      const newComment = await dataService.createBlogComment(id, commentContent);
      setBlog({
        ...blog,
        comments: [...(blog.comments || []), newComment]
      });
      setCommentContent('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setCommentError('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dataService.deleteBlogComment(commentId);
        setBlog({
          ...blog,
          comments: blog.comments.filter(c => c.id !== commentId)
        });
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert('Failed to delete comment.');
      }
    }
  };

  const getCoverUrl = (path) => getMediaUrl(path);

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
            {blog.author?.avatar ? (
              <img src={blog.author.avatar} alt={blog.author?.username || 'Author'} className="w-full h-full object-cover" />
            ) : (
              <img src="https://i.pravatar.cc/150?u=default" alt={blog.author?.username || 'Author'} className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <p className="text-[#0F4C81] text-sm font-bold">{blog.author?.username || 'Anonymous'}</p>
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

        {/* Comments Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-[#0F4C81] text-2xl font-bold mb-8">Comments ({blog.comments?.length || 0})</h2>

          {/* Comment Form */}
          {user ? (
            <div className="mb-12 bg-white rounded-[24px] p-8 shadow-sm border border-gray-50">
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                    <img
                      src={user?.avatar
                        ? getBackendAssetUrl(user.avatar)
                        : `https://i.pravatar.cc/150?u=${user?.username}`
                      }
                      alt={user?.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0F4C81] text-sm font-bold mb-3">{user.username}</p>
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Share your thoughts about this article..."
                      className="w-full bg-[#F8FAFF] rounded-2xl p-4 text-sm outline-none border border-transparent focus:border-[#006699] transition-all min-h-[100px] resize-none"
                    />
                    {commentError && (
                      <p className="text-red-500 text-xs mt-2">{commentError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={submittingComment || !commentContent.trim()}
                      className="mt-4 bg-[#006699] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#004d73] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? 'Publishing...' : 'Publish Comment'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="mb-12 bg-blue-50 rounded-[24px] p-8 border border-blue-100">
              <p className="text-[#0F4C81] text-sm">
                <Link to="/login" className="font-bold text-[#006699] hover:underline">Sign in</Link> to leave a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map(comment => (
                <div key={comment.id} className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                        {comment.author?.avatar ? (
                          <img src={comment.author.avatar} alt={comment.author.username} className="w-full h-full object-cover" />
                        ) : (
                          <img src="https://i.pravatar.cc/150?u=default" alt={comment.author?.username} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[#0F4C81] text-sm font-bold">{comment.author?.username}</p>
                        <p className="text-gray-400 text-xs font-medium mb-3">
                          {new Date(comment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                    {user && (user.id === comment.author?.id || user.is_staff) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                        title="Delete comment"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;