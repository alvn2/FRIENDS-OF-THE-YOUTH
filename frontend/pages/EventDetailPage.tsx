import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { EVENTS_DATA, ACHIEVEMENTS_DATA } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const initialEvent = EVENTS_DATA.find(e => e.id === parseInt(id || ''));

  const [eventData, setEventData] = useState(initialEvent);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const { isAuthenticated, user, addAchievement } = useAuth();
  const { addNotification } = useNotification();
  const location = useLocation();

  const handleRegister = async () => {
    if (!isAuthenticated || !eventData || !user) return;

    setIsRegistering(true);
    try {
      // Mock API call to register for the event
      await api.post(`/events/${eventData.id}/register`, { userId: user.id });

      setEventData(prevEvent => {
        if (!prevEvent) return undefined;
        return { ...prevEvent, attendees: prevEvent.attendees + 1 };
      });
      setIsRegistered(true);
      addNotification(`Successfully registered for ${eventData.title}!`, 'success', { persistent: true, persistentType: 'event', link: `/events/${eventData.id}` });

      // Award 'Event Goer' achievement if it's their first time
      const eventGoerAchievement = ACHIEVEMENTS_DATA.find(a => a.id === 'event_goer');
      if (eventGoerAchievement && !user.achievements.some(a => a.id === eventGoerAchievement.id)) {
        await addAchievement(eventGoerAchievement);
        addNotification(`Achievement Unlocked: ${eventGoerAchievement.name}!`, 'success', { persistent: true, persistentType: 'achievement', link: '/settings' });
      }
    } catch (err) {
      addNotification('Registration failed. Please try again later.', 'error', { persistent: false });
    } finally {
      setIsRegistering(false);
    }
  };

  if (!eventData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Event not found</h1>
        <p className="mt-4">The event you are looking for does not exist.</p>
        <Link to="/events" className="text-brand-primary hover:underline mt-6 inline-block">
          &larr; Back to all events
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-bg py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link to="/events" className="text-brand-primary hover:underline text-sm">
            &larr; Back to all events
          </Link>
        </div>
        <article className="prose dark:prose-invert max-w-none">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2 mb-4">{eventData.title}</h1>
          <div className="text-gray-500 dark:text-gray-400 text-base mb-6 space-y-1">
            <p><strong>Date:</strong> {eventData.date}</p>
            <p><strong>Location:</strong> {eventData.location}</p>
            <p><strong>Registered Attendees:</strong> {eventData.attendees}</p>
          </div>
          <img src={eventData.image} alt={eventData.title} className="w-full rounded-lg shadow-lg mb-8" />
          
          <div className="text-lg text-gray-700 dark:text-gray-300 space-y-4">
            {eventData.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Registration Section */}
        <div className="mt-12 text-center border-t dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-4">Join Us!</h2>
          {isAuthenticated ? (
            isRegistered ? (
              <div className="p-4 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200 rounded-lg inline-block">
                <p className="font-semibold text-lg">✅ You are registered for this event!</p>
                <p>We look forward to seeing you there.</p>
              </div>
            ) : (
              <button 
                onClick={handleRegister} 
                disabled={isRegistering}
                className="inline-block text-white bg-brand-primary hover:bg-brand-primary-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-8 py-3.5 text-center transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isRegistering ? 'Registering...' : 'Register for this Event'}
              </button>
            )
          ) : (
            <div className="p-4 bg-gray-100 dark:bg-dark-card rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <Link to="/login" state={{ from: location }} className="text-brand-primary font-bold hover:underline">Log in</Link> or <Link to="/register" className="text-brand-primary font-bold hover:underline">create an account</Link> to register for this event.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
