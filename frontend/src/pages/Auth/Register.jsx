import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import algeImg from '../../assets/alge.jpg';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    
    setIsLoading(true);

    const backendData = {
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
      password_confirm: formData.confirmPassword
    };

    const result = await register(backendData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      if (result.errors) {
        setFieldErrors(result.errors);
      }
    }
    
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Side: Cinematic Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={algeImg} 
          alt="Algeria" 
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-20 left-20 right-20 space-y-6">
          <h1 className="text-white text-6xl font-extrabold tracking-tight leading-tight">
            Join the <br /> journey.
          </h1>
          <p className="text-white/80 text-xl max-w-lg leading-relaxed">
            Create your account and start exploring the hidden wonders of Algeria today.
          </p>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-12 md:px-24 py-20 relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-12">
          {/* Logo & Header */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#006699] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-black text-[#0F4C81] tracking-tighter italic">Wander</span>
              </div>
            </Link>
            <h2 className="text-4xl font-extrabold text-[#0F4C81] tracking-tight">Create Account</h2>
            <p className="text-gray-400 font-medium">Join our community of explorers.</p>
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
            
            {/* Name Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-[#0F4C81] text-sm font-bold ml-1">First Name</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input 
                    type="text" 
                    required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className={`w-full bg-[#F8FAFF] rounded-2xl py-4 pl-16 pr-8 text-sm outline-none border-2 transition-all font-medium ${fieldErrors.first_name ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-[#006699] focus:bg-white'}`}
                  />
                </div>
                {fieldErrors.first_name && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{fieldErrors.first_name[0]}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-[#0F4C81] text-sm font-bold ml-1">Last Name</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input 
                    type="text" 
                    required
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className={`w-full bg-[#F8FAFF] rounded-2xl py-4 pl-16 pr-8 text-sm outline-none border-2 transition-all font-medium ${fieldErrors.last_name ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-[#006699] focus:bg-white'}`}
                  />
                </div>
                {fieldErrors.last_name && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{fieldErrors.last_name[0]}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[#0F4C81] text-sm font-bold ml-1">Email Address</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                </svg>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full bg-[#F8FAFF] rounded-2xl py-4 pl-16 pr-8 text-sm outline-none border-2 transition-all font-medium ${fieldErrors.email ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-[#006699] focus:bg-white'}`}
                />
              </div>
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{fieldErrors.email[0]}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[#0F4C81] text-sm font-bold ml-1">Create Password</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                   value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full bg-[#F8FAFF] rounded-2xl py-4 pl-16 pr-14 text-sm outline-none border-2 transition-all font-medium ${fieldErrors.password ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-[#006699] focus:bg-white'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#006699] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.956 9.956 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                  </svg>
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{fieldErrors.password[0]}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[#0F4C81] text-sm font-bold ml-1">Confirm Password</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full bg-[#F8FAFF] rounded-2xl py-4 pl-16 pr-14 text-sm outline-none border-2 transition-all font-medium ${fieldErrors.password_confirm ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-[#006699] focus:bg-white'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#006699] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirmPassword ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.956 9.956 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                  </svg>
                </button>
              </div>
              {fieldErrors.password_confirm && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{fieldErrors.password_confirm[0]}</p>}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#FF7F50] text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-orange-100 flex items-center justify-center space-x-3 transform hover:scale-[1.01] ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#E67348]'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-4">
            <p className="text-gray-400 font-medium">
              Already have an account? <Link to="/login" className="text-[#006699] font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
