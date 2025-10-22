import React, { useState } from 'react';
import { FAQ_DATA } from '../constants';

const FAQItem: React.FC<{ item: { question: string, answer: string }, isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <h2>
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-left text-gray-800 dark:text-white"
          onClick={onClick}
          aria-expanded={isOpen}
        >
          <span>{item.question}</span>
          <svg
            className={`w-6 h-6 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </h2>
      <div className={`${isOpen ? 'block' : 'hidden'} py-5 border-t border-gray-200 dark:border-gray-700`}>
        <p className="mb-2 text-gray-500 dark:text-gray-400">{item.answer}</p>
      </div>
    </div>
  );
};

const FAQPage: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const handleClick = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-white dark:bg-dark-bg">
      <div className="py-8 px-4 mx-auto max-w-screen-md lg:py-16">
        <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {FAQ_DATA.map(item => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onClick={() => handleClick(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQPage;