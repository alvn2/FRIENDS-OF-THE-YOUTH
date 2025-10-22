import React from 'react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l-.579 2.129 2.15- .566z" />
  </svg>
);

const WhatsAppBubble: React.FC = () => {
  const WHATSAPP_NUMBER = '254756367965'; // International format without '+'
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-50 flex items-center"
      aria-label="Contact us on WhatsApp"
    >
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-2 bg-white dark:bg-dark-card text-sm font-semibold text-light-text dark:text-dark-text rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Contact us
      </span>

      {/* Bubble */}
      <div className="w-14 h-14 bg-[#25d366] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
        <WhatsAppIcon className="w-8 h-8 text-white" />
      </div>
    </a>
  );
};

export default WhatsAppBubble;