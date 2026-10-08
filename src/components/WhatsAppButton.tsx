import React, { useState } from 'react';
import { siteConfig } from '@/config';
import { motion, AnimatePresence } from 'framer-motion';

export const WhatsAppButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3">
      {/* Tooltip on hover/large screens */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:block bg-[#1A1411]/90 backdrop-blur-md text-[#F3E6D0] border border-[#F3E6D0]/20 text-xs font-medium py-1.5 px-3 rounded-lg shadow-lg pointer-events-none"
          >
            Reservar mesa no WhatsApp
          </motion.div>
        )}
      </AnimatePresence>

      {/* Amber Floating WhatsApp Button */}
      <motion.a
        href={siteConfig.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com o Braseiro Caiçara no WhatsApp para reservas"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D9741C] text-[#1A1411] flex items-center justify-center shadow-[0_6px_25px_rgba(217,116,28,0.55)] border-2 border-[#F2B25A]/40 transition-shadow hover:shadow-[0_8px_32px_rgba(242,178,90,0.7)] group"
      >
        {/* WhatsApp Icon (clean SVG) */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow group-hover:scale-105 transition-transform"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.16-3.02.79.81-2.95-.19-.3a8.217 8.217 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.5 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.65.81-.8 1-.15.19-.3.21-.55.08-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.41.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.2 1.16.17 1.6.11.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z" />
        </svg>

        {/* Pulse ring animation */}
        <span className="absolute -inset-1 rounded-full border-2 border-[#D9741C] animate-ping opacity-25 pointer-events-none" />
      </motion.a>
    </div>
  );
};
