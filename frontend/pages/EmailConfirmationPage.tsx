import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const EmailConfirmationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('No verification token provided.');
        return;
      }

      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.response?.data?.msg || 'Verification failed. The link may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-red mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
          </>
        );
      case 'success':
        return (
          <>
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Email Verified Successfully!</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your account is now active. You can now log in to access your dashboard.
            </p>
            <Link to="/login" className="inline-block px-8 py-3 text-lg font-semibold text-white bg-brand-red rounded-lg hover:bg-brand-red-dark">
              Go to Login
            </Link>
          </>
        );
      case 'error':
        return (
          <>
            <div className="text-red-500 mb-4">
               <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {errorMessage}
            </p>
            <Link to="/login" className="text-brand-red hover:underline font-medium">
              Back to Login
            </Link>
          </>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white dark:bg-dark-card p-8 rounded-lg shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailConfirmationPage;