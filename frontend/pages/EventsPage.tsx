import React from 'react';
import { Link } from 'react-router-dom';
import { EVENTS_DATA } from '../constants';
import { useAuth } from '../context/AuthContext';

const EventsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Upcoming Events</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
          Join us at our events to support our cause, connect with the community, and witness our impact firsthand.
        </p>
      </div>

      <div className="space-y-12">
        {EVENTS_DATA.map((event) => (
          <div key={event.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
            <img src={event.image} alt={event.title} className="rounded-lg w-full h-64 object-cover" />
            <div>
              <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                <span className="font-semibold">{event.date}</span> @ {event.location}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{event.description}</p>
              {isAuthenticated ? (
                <Link 
                  to={`/events/${event.id}`}
                  className="inline-block text-white bg-brand-primary hover:bg-brand-primary-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300"
                >
                  View Details
                </Link>
              ) : (
                  <Link 
                  to="/login"
                  state={{ from: { pathname: `/events/${event.id}` } }}
                  className="inline-block text-white bg-brand-primary hover:bg-brand-primary-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors duration-300"
                >
                  Login to View Details
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
