import React from 'react';
import { NEWS_DATA } from '../constants';

const NewsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Latest News</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
          Read about our recent activities, success stories, and announcements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {NEWS_DATA.map((article) => (
          <div key={article.id} className="bg-white dark:bg-dark-card rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{article.date}</p>
              <h3 className="text-xl font-bold mb-2 flex-grow">{article.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{article.excerpt}</p>
              <a href={`#/news/${article.id}`} className="text-brand-red hover:text-brand-red-dark font-semibold self-start">
                Read More &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;