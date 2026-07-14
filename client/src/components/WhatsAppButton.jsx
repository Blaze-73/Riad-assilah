import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const phone = '212612345678';
  const baseText = encodeURIComponent('Hello, I would like to book a room.');
  const url = `https://wa.me/${phone}?text=${baseText}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contact us on WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.52 3.48A11.91 11.91 0 0012.04 0C5.5 0 .12 5.38 .12 11.92c0 2.1.55 4.16 1.6 5.97L0 24l6.27-1.64a11.92 11.92 0 005.77 1.48h.01c6.55 0 11.93-5.38 11.93-11.93 0-3.19-1.25-6.19-3.46-8.42zM12.04 21.56h-.01a9.65 9.65 0 01-4.91-1.34l-.35-.21-3.73.98 1-3.63-.23-.37a9.65 9.65 0 1118.26 5.62c0 5.31-4.33 9.65-9.93 9.65z" />
      </svg>
    </motion.a>
  );
}
