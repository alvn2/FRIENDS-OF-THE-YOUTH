import React, { useState } from 'react';
// Fix: Use namespace import for 'react-router-dom' to resolve module export errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // This is a simulated API call.
      // In a real backend, this would trigger an email with a reset token.
      await api.post('/auth/forgot-password', { email });
      addNotification('If an account with that email exists, a password reset link has been sent.', 'success');
      setEmail('');
    } catch (err: any) {
      // To prevent user enumeration, we show a success message even on error.
      // In a real app, you might log the error server-side.
      addNotification('If an account with that email exists, a password reset link has been sent.', 'success');
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white dark:bg-dark-bg">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:py-16">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-dark-card dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot Your Password?
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No problem. Enter your email address below and we'll send you a link to reset your password.
            </p>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="forgot-password-email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="forgot-password-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brand-red focus:border-brand-red block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@foty.org"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white bg-brand-red hover:bg-brand-red-dark focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-400"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400">
                Remember your password? <ReactRouterDOM.Link to="/login" className="font-medium text-brand-red hover:underline">Back to Login</ReactRouterDOM.Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;