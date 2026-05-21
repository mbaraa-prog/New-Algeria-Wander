import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate adding to blogs (usually would hit an API)
    console.log('Publishing Blog:', formData);
    
    // Redirect back to blogs
    navigate('/blogs');
  };

  return (
    <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-[#0F4C81] text-5xl font-extrabold tracking-tight">Share Your Adventure</h1>
          <p className="text-gray-400 text-lg font-medium">
            Inspire others with your journey through the Mediterranean and the Sahara.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-12 space-y-12">
          
          {/* Image Input (Styled as Upload) */}
          <div className="space-y-4">
            <label className="text-[#0F4C81] text-sm font-bold uppercase tracking-widest ml-1">Cover Image</label>
            <div className="relative group">
              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 hover:border-[#006699] hover:bg-[#F8FAFF] transition-all cursor-pointer">
                <div className="bg-[#EEF4FF] p-4 rounded-2xl text-[#006699]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[#0F4C81] font-bold">
                    <span className="text-[#006699] hover:underline">Upload a file</span> or drag and drop
                  </p>
                  <p className="text-gray-400 text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Or paste an image URL here..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full mt-4 bg-[#F8FAFF] rounded-2xl py-4 px-6 text-sm outline-none border border-transparent focus:border-[#006699] focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-4">
            <label className="text-[#0F4C81] text-sm font-bold uppercase tracking-widest ml-1">Blog Title</label>
            <input 
              type="text" 
              required
              placeholder="A Sunset in Tassili n'Ajjer"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-[#F8FAFF] rounded-2xl py-5 px-8 text-sm outline-none border border-transparent focus:border-[#006699] focus:bg-white transition-all shadow-inner font-medium text-[#0F4C81]"
            />
          </div>

          {/* Story Input (Textarea) */}
          <div className="space-y-4">
            <label className="text-[#0F4C81] text-sm font-bold uppercase tracking-widest ml-1">Story</label>
            <div className="bg-[#F8FAFF] rounded-3xl overflow-hidden border border-transparent focus-within:border-[#006699] focus-within:bg-white transition-all shadow-inner">
              {/* Toolbar Mockup */}
              <div className="flex items-center space-x-6 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <button type="button" className="text-gray-400 hover:text-[#0F4C81] transition-colors"><span className="font-serif font-bold text-lg">B</span></button>
                <button type="button" className="text-gray-400 hover:text-[#0F4C81] transition-colors"><span className="font-serif italic text-lg">I</span></button>
                <button type="button" className="text-gray-400 hover:text-[#0F4C81] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button type="button" className="text-gray-400 hover:text-[#0F4C81] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>
              <textarea 
                required
                rows="12"
                placeholder="Tell us about your adventure..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-transparent py-8 px-8 text-sm outline-none font-medium text-gray-600 leading-relaxed resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button 
              type="submit"
              className="bg-[#91470A] text-white px-12 py-4 rounded-2xl font-bold hover:bg-[#7a3c08] transition-all shadow-xl shadow-orange-900/10 transform hover:scale-[1.02]"
            >
              Publish Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
