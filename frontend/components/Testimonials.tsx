import React from 'react';
import { TESTIMONIALS_DATA } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <section className="bg-white dark:bg-dark-bg py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
          Voices from Our Community
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((testimonial) => (
            <figure key={testimonial.id} className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border-b border-gray-200 md:border-b-0 md:border-r dark:bg-dark-card dark:border-gray-700">
              <blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
                <p className="my-4">"{testimonial.quote}"</p>
              </blockquote>
              <figcaption className="flex items-center justify-center space-x-3">
                <img className="rounded-full w-9 h-9 object-cover" src={testimonial.image} alt={`${testimonial.name} profile picture`} />
                <div className="space-y-0.5 font-medium dark:text-white text-left">
                  <div>{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;