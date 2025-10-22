import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState({ password: '', password2: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const { password, password2 } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== password2) {
      addNotification('Passwords do not match.', 'error');
      return;
    }
    if (!token) {
      addNotification('Invalid or missing reset token.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      // This is a simulated API call.
      // In a real backend, this would verify the token and update the user's password.
      await api.post(`/auth/reset-password/${token}`, { password });
      addNotification('Password has been reset successfully. Please log in.', 'success');
      navigate('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.msg || "Failed to reset password. The link may have expired.";
      addNotification(errorMessage, 'error');
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
              Reset Your Password
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label htmlFor="password2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm New Password</label>
                <input
                  type="password"
                  name="password2"
                  id="password2"
                  value={password2}
                  onChange={onChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white bg-brand-primary hover:bg-brand-primary-dark focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-400"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
