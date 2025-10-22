import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { NEWS_DATA } from '../constants';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = NEWS_DATA.find(article => article.id === parseInt(id || ''));

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <p className="mt-4">The news article you are looking for does not exist.</p>
        <Link to="/news" className="text-brand-primary hover:underline mt-6 inline-block">
          &larr; Back to all news
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-bg py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <article className="prose dark:prose-invert max-w-none">
          <div className="mb-6">
            <Link to="/news" className="text-brand-primary hover:underline text-sm">
              &larr; Back to all news
            </Link>
          </div>
          <span className="text-sm font-semibold text-brand-primary uppercase">{article.category}</span>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">{article.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-base mb-6">Published on {article.date}</p>
          <img src={article.image} alt={article.title} className="w-full rounded-lg shadow-lg mb-8" />
          
          <div className="text-lg text-gray-700 dark:text-gray-300 space-y-4">
            {article.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default NewsDetailPage;
