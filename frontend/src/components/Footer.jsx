import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#EEF4FF] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-8">
            <h2 className="text-[#0F4C81] text-2xl font-bold tracking-tight">Algeria Wander</h2>
            <p className="text-gray-500 leading-relaxed text-[15px] font-medium">
              Discover the beauty of the Mediterranean and the Sahara. Your sophisticated companion for exploring the breathtaking duality of Algeria.
            </p>
            <div className="flex items-center space-x-6">
              {/* Globe */}
              <a href="#" className="text-[#0F4C81] hover:opacity-70 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
              {/* Camera/Insta */}
              <a href="#" className="text-[#0F4C81] hover:opacity-70 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </a>
              {/* Message */}
              <a href="#" className="text-[#0F4C81] hover:opacity-70 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-8">
            <h3 className="text-[#0F4C81] text-lg font-bold">Quick Links</h3>
            <ul className="space-y-4 text-gray-600 text-[15px] font-medium">
              <li><Link to="/privacy" className="hover:text-[#0F4C81] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#0F4C81] transition-colors">Terms of Service</Link></li>
              <li><Link to="/guides" className="hover:text-[#0F4C81] transition-colors">Travel Guides</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-8">
            <h3 className="text-[#0F4C81] text-lg font-bold">Categories</h3>
            <ul className="space-y-4 text-gray-600 text-[15px] font-medium">
              <li><Link to="/search?c=coastal" className="hover:text-[#0F4C81] transition-colors">Coastal Escapes</Link></li>
              <li><Link to="/search?c=sahara" className="hover:text-[#0F4C81] transition-colors">Sahara Expeditions</Link></li>
              <li><Link to="/search?c=historic" className="hover:text-[#0F4C81] transition-colors">Historic Ruins</Link></li>
              <li><Link to="/search?c=urban" className="hover:text-[#0F4C81] transition-colors">Urban Exploration</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-8">
            <h3 className="text-[#0F4C81] text-lg font-bold">Newsletter</h3>
            <p className="text-gray-600 text-[15px] font-medium leading-relaxed">
              Subscribe to get the latest travel tips and destination guides.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white rounded-full px-6 py-4 text-[14px] outline-none shadow-sm border border-transparent focus:border-[#0F4C81]/20 transition-all"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#91470A] text-white px-6 rounded-full flex items-center space-x-2 hover:bg-[#7a3c08] transition-colors">
                <span className="text-[13px] font-bold">Subscribe</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-10 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <p className="text-gray-500 text-[13px] font-medium">
            © 2024 Algeria Wander. Discover the beauty of the Mediterranean and the Sahara.
          </p>
          <div className="flex items-center space-x-8 text-gray-500 text-[13px] font-bold">
            <Link to="/privacy" className="hover:text-[#0F4C81]">Privacy</Link>
            <Link to="/terms" className="hover:text-[#0F4C81]">Terms</Link>
            <Link to="/cookies" className="hover:text-[#0F4C81]">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
