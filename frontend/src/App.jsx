// Updated: 2026-05-08 10:17
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './layouts/Layout';
import PageTransition from './components/PageTransition';

// Pages
import Home from './pages/Home';
import Wilayas from './pages/Wilayas';
import WilayaDetails from './pages/WilayaDetails';
import Details from './pages/Details';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Blogs from './pages/Blogs';
import AddBlog from './pages/AddBlog';
import BlogDetail from './pages/BlogDetail';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Routes with No Navbar/Footer */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />

        {/* Main Application Routes (With Navbar/Footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="wilayas" element={<Wilayas key="wilayas" />} />
          <Route path="wilaya/:id" element={<WilayaDetails />} />
          <Route path="details/:id" element={<Details />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/new" element={<ProtectedRoute><AddBlog /></ProtectedRoute>} />
          <Route path="blogs/:id" element={<BlogDetail />} />
          <Route path="search" element={<Search />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

          {/* User Specific - Protected */}
          <Route path="favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;