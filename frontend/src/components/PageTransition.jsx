import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      className="w-full"
      style={{ 
        position: 'relative',
        width: '100%',
        display: 'block',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        opacity: 0 // Keep it hidden until Framer Motion starts
      }}
      initial={{ opacity: 0, scale: 1.05, filter: 'blur(15px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(15px)', transition: { duration: 0.4 } }}
      transition={{ 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
