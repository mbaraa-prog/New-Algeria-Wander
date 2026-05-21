import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background with Sahara Imagery */}
      <img 
        src="https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=2000" 
        alt="Lost in Sahara" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-12 px-6">
        <div className="space-y-4">
          <h1 className="text-white text-[12rem] font-extrabold leading-none tracking-tighter opacity-90">404</h1>
          <div className="space-y-4">
            <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight">Oops! This page wandered off into the dunes.</h2>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              It seems you've ventured a bit too far into the Sahara. Let's get you back on track.
            </p>
          </div>
        </div>

        <Link 
          to="/" 
          className="inline-flex items-center gap-4 bg-[#006699] text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-[#004d73] transition-all shadow-2xl hover:scale-105 transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black/80 to-transparent"></div>
    </div>
  );
};

export default NotFound;
