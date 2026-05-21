import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force immediate scroll to top without any smoothing that might cause jumps
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
