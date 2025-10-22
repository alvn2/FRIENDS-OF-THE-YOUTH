import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

const ContactPage: React.FC = () => {
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
        await api.post('/contact', formData);
        addNotification('Thank you for your message! We will get back to you shortly.', 'success');
        setFormData({ email: '', subject: '', message: '' });
    } catch (err) {
        addNotification('Failed to send message. Please try again later.', 'error');
    } finally {
        setIsLoading(false);
    }
  };
    
  return (
    <section className="bg-white dark:bg-dark-bg">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Contact Us</h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Have a question? Want to partner with us? Or simply want to say hello? We’d love to hear from you.</p>
          <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" placeholder="name@foty.org" required />
              </div>
              <div>
                  <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
                  <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600" placeholder="Let us know how we can help you" required />
              </div>
              <div className="sm:col-span-2">
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={6} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600" placeholder="Leave a comment..." required></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-brand-primary sm:w-fit hover:bg-brand-primary-dark focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-gray-400"
              >
                {isLoading ? 'Sending...' : 'Send message'}
              </button>
          </form>
          <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
            <h3 className="font-semibold text-lg mb-2">Address</h3>
            <p>KICC, Nairobi, Kenya</p>
            <div className="mt-4">
                <h3 className="font-semibold text-lg mb-1">Email</h3>
                <p>info@foty.com</p>
                <p>support@foty.com</p>
            </div>
            <div className="mt-4">
                <h3 className="font-semibold text-lg mb-1">Phone</h3>
                <p>+254 756 367 965</p>
            </div>
          </div>
      </div>
    </section>
  );
};

export default ContactPage;
