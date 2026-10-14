import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTopOnRoute = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const scrollToAnchor = () => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      if (!scrollToAnchor()) {
        const timer = setTimeout(scrollToAnchor, 150);
        return () => clearTimeout(timer);
      } else {
        // Segundo passe para acomodar hidratação e acomodação de fontes/layout
        const timer = setTimeout(scrollToAnchor, 250);
        return () => clearTimeout(timer);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
};
