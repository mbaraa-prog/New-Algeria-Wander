import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../config/api';
import logo from '../assets/photo_2026-02-14_23-36-08-removebg-preview.png';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = location.pathname === '/';

  // Update scrolled state on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Wilayas', path: '/wilayas' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  // Determine if the navbar should have a solid appearance
  const isSolid = !isHome || isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-500 ${isSolid
          ? 'bg-white/95 backdrop-blur-md shadow-md py-4'
          : 'bg-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 group">
          <img
            src={logo}
            alt="Algeria Wander Logo"
            className={`h-12 w-auto transition-all duration-300 ${isHome && !isScrolled ? 'brightness-0 invert' : ''}`}
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative py-2 text-[14px] font-bold tracking-wide transition-all duration-300 ${isHome && !isScrolled
                  ? 'text-white hover:text-[#FF7F50]'
                  : (isActive(link.path) ? 'text-[#006699]' : 'text-gray-600 hover:text-[#006699]')
                }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className={`absolute bottom-0 left-0 w-full h-[2.5px] rounded-full animate-grow-width ${isHome && !isScrolled ? 'bg-[#FF7F50]' : 'bg-[#006699]'
                  }`} />
              )}
            </Link>
          ))}
        </div>

        {/* Auth / Profile Actions */}
        <div className="flex items-center space-x-8">
          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <Link
                to="/notifications"
                className={`${isHome && !isScrolled ? 'text-white' : 'text-gray-600'} hover:text-[#FF7F50] transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </Link>

              <Link
                to="/favorites"
                className={`${isHome && !isScrolled ? 'text-white' : 'text-gray-600'} hover:text-[#FF7F50] transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              <Link to="/profile" className="flex items-center">
                <div className={`h-11 w-11 rounded-full border-2 overflow-hidden transition-colors ${isHome && !isScrolled ? 'border-white/30' : 'border-[#006699]/30'}`}>
                  <img
                    src={getAvatarUrl(user) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=006699&color=fff&size=200`}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className={`font-bold text-[14px] transition-colors ${isHome && !isScrolled ? 'text-white hover:text-[#FF7F50]' : 'text-gray-600 hover:text-[#006699]'}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-8 py-2.5 rounded-full font-bold text-[14px] transition-all transform hover:scale-105 ${isHome && !isScrolled
                    ? 'bg-white text-[#0F4C81] hover:bg-[#FF7F50] hover:text-white'
                    : 'bg-[#006699] text-white hover:bg-[#004d73]'
                  }`}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
