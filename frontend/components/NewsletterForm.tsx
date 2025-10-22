import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

const NewsletterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            addNotification('Please enter a valid email address.', 'error');
            return;
        }
        setIsLoading(true);
        try {
            await api.post('/newsletter/subscribe', { email });
            addNotification(`Thank you for subscribing, ${email}!`, 'success');
            setEmail('');
        } catch (error: any) {
            const errorMessage = error.response?.data?.msg || 'Subscription failed. Please try again.';
            addNotification(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-dark-card">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md sm:text-center">
                    <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-white">Stay Updated</h2>
                    <p className="mx-auto mb-8 max-w-2xl font-light text-gray-500 md:mb-12 sm:text-xl dark:text-gray-400">Subscribe to our newsletter to get the latest news, event updates, and success stories straight to your inbox.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
                            <div className="relative w-full">
                                <label htmlFor="email" className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email address</label>
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                                </div>
                                <input
                                    className="block p-3 pl-10 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-brand-red focus:border-brand-red dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-red dark:focus:border-brand-red"
                                    placeholder="Enter your email"
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <button type="submit" disabled={isLoading} className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-brand-red border-brand-red sm:rounded-none sm:rounded-r-lg hover:bg-brand-red-dark focus:ring-4 focus:ring-red-300 disabled:bg-gray-400">
                                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </div>
                        </div>
                        <div className="mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer dark:text-gray-300">We care about the protection of your data. <a href="#/terms-and-conditions" className="font-medium text-brand-red hover:underline">Read our Privacy Policy</a>.</div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default NewsletterForm;