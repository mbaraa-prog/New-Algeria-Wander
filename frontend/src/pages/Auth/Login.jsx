import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import alge1Img from '../../assets/alge1.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember_me: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(formData.email, formData.password, formData.remember_me);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Side: Cinematic Image */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img 
          src={alge1Img} 
          alt="Algeria" 
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-20 left-20 right-20 space-y-6">
          <h1 className="text-white text-6xl font-extrabold tracking-tight leading-tight">
            Discover the magic <br /> of Tikjda.
          </h1>
          <p className="text-white/80 text-xl max-w-lg leading-relaxed">
            Your gateway to the Mediterranean breeze and Saharan warmth starts here.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-2/5 bg-white flex flex-col justify-center px-12 md:px-24 py-20 relative">
        <div className="max-w-md w-full mx-auto space-y-10">
          {/* Header */}
          <div className="space-y-3">
            <h2 className="text-[#0F4C81] text-4xl font-extrabold tracking-tight">Welcome Back</h2>
            <p className="text-gray-400 font-medium">Sign in to continue your Algerian journey.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[#0F4C81] text-sm font-bold ml-1">Email address</label>
              <input 
                type="email" 
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#F8FAFF] rounded-2xl py-4 px-6 text-sm outline-none border-2 border-transparent focus:border-[#006699] focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#0F4C81] text-sm font-bold ml-1">Password</label>
              <div className="relative group">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-[#F8FAFF] rounded-2xl py-4 px-6 text-sm outline-none border-2 border-transparent focus:border-[#006699] focus:bg-white transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#006699] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.remember_me}
                    onChange={(e) => setFormData({...formData, remember_me: e.target.checked})}
                  />
                  <div className="w-5 h-5 bg-[#F8FAFF] border-2 border-gray-100 rounded-lg peer-checked:bg-[#006699] peer-checked:border-[#006699] transition-all"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-400 text-sm font-medium group-hover:text-gray-600 transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#006699] text-sm font-bold hover:underline">Forgot your password?</Link>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#006699] text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-100 transform hover:scale-[1.01] flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#004d73]'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-4">
            <p className="text-gray-400 font-medium">
              Don’t have an account? <Link to="/register" className="text-[#006699] font-bold hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
