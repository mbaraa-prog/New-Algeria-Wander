import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../api/auth';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatar: null,
    avatarPreview: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success) {
          const u = response.data.user;
          setFormData({
            firstName: u.first_name || '',
            lastName: u.last_name || '',
            bio: u.bio || '',
            avatarPreview: u.avatar || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        avatar: file,
        avatarPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      data.append('first_name', formData.firstName);
      data.append('last_name', formData.lastName);
      data.append('bio', formData.bio);
      if (formData.avatar instanceof File) {
        data.append('avatar', formData.avatar);
      }

      const response = await authService.updateProfile(data);
      if (response.success) {
        const updatedProfile = await authService.getProfile();
        if (updatedProfile.success) {
          updateUser(updatedProfile.data.user);
        }
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => navigate('/profile'), 1500);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed.' });
    } finally {
      setIsSaving(false);
    }
  };


  const menuItems = [
    { name: 'Personal Info', path: '/profile/edit', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', active: true },
    { name: 'Notifications', path: '/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', active: false },
    { name: 'Favorites', path: '/favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', active: false },
  ];

  return (
    <div className="bg-[#F8FAFF] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

        {/* Sidebar Settings Menu */}
        <aside className="lg:w-1/4">
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-50 space-y-10">
            <h2 className="text-[#0F4C81] text-3xl font-bold px-4">Settings</h2>
            <nav className="space-y-2">
              {menuItems.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${item.active
                    ? 'bg-[#EEF4FF] text-[#006699]'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content: Edit Form */}
        <main className="lg:w-3/4 space-y-12">

          {isLoading ? (
            <div className="bg-white rounded-[40px] p-24 shadow-sm border border-gray-50 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#006699] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">

              {/* Alerts */}
              {message.text && (
                <div className={`p-4 rounded-2xl font-bold text-center ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {message.text}
                </div>
              )}

              {/* Profile Picture Card */}
              <div className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-50 space-y-10">
                <h3 className="text-[#0F4C81] text-2xl font-bold">Profile Picture</h3>
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-[#F8FAFF]">
                    <img src={formData.avatarPreview ? (formData.avatarPreview.startsWith('blob') || formData.avatarPreview.startsWith('http') ? formData.avatarPreview : getBackendAssetUrl(formData.avatarPreview)) : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&background=006699&color=fff&size=200`} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-4 text-center md:text-left">
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('avatar-upload').click()}
                        className="bg-[#006699] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#004d73] transition-all"
                      >
                        Change Photo
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs font-medium">JPG, GIF or PNG. Max size of 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Basic Information Card */}
              <div className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-50 space-y-10">
                <h3 className="text-[#0F4C81] text-2xl font-bold">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* First Name */}
                  <div className="space-y-3">
                    <label className="text-[#0F4C81] text-xs font-bold uppercase tracking-widest ml-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-[#F8FAFF] rounded-2xl py-4 px-8 text-sm outline-none border border-transparent focus:border-[#006699] transition-all shadow-inner"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-3">
                    <label className="text-[#0F4C81] text-xs font-bold uppercase tracking-widest ml-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-[#F8FAFF] rounded-2xl py-4 px-8 text-sm outline-none border border-transparent focus:border-[#006699] transition-all shadow-inner"
                    />
                  </div>

                  {/* Email (Read Only for safety, or as part of update if backend allows) */}
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[#0F4C81] text-xs font-bold uppercase tracking-widest ml-2">Email Address (Read Only)</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full bg-[#F3F4F6] text-gray-400 rounded-2xl py-4 px-8 text-sm outline-none border border-transparent transition-all shadow-inner cursor-not-allowed"
                    />
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[#0F4C81] text-xs font-bold uppercase tracking-widest ml-2">Bio</label>
                    <textarea
                      rows="4"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-[#F8FAFF] rounded-3xl py-6 px-8 text-sm outline-none border border-transparent focus:border-[#006699] transition-all shadow-inner resize-none leading-relaxed text-gray-500"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-8 pt-6">
                <Link to="/profile" className="text-gray-400 font-bold text-sm hover:text-gray-600">Cancel</Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`bg-[#FF7F50] text-white px-12 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-orange-100 transform hover:scale-[1.02] flex items-center justify-center min-w-[200px] ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#E67348]'}`}
                >
                  {isSaving ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditProfile;
