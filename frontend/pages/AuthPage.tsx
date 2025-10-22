import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Fix: Updated handleLogin to be async and call login with correct arguments.
  const handleLogin = async (role: 'member' | 'admin') => {
    try {
        if (role === 'admin') {
          await login('admin@foty.org', 'password123'); // Using mock credentials
          navigate('/admin');
        } else {
          await login('member@foty.org', 'password123'); // Using mock credentials
          navigate('/dashboard');
        }
    } catch (e) {
        console.error("Login failed:", e);
        // In a real app, you'd show an error notification here.
    }
  };
  
  return (
    <section className="bg-white dark:bg-dark-bg">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:py-16">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-dark-card dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Join or Sign in to your account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              This is a demonstration app. Select a role to simulate logging in.
            </p>
            <div className="space-y-4">
               <button
                  onClick={() => handleLogin('member')}
                  className="w-full text-white bg-brand-red hover:bg-brand-red-dark focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-brand-red dark:hover:bg-brand-red-dark dark:focus:ring-red-800"
                >
                  Login as Member
                </button>
                <button
                  onClick={() => handleLogin('admin')}
                  className="w-full text-gray-800 dark:text-white bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                  Login as Admin
                </button>
            </div>
             <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet? <a href="#" className="font-medium text-brand-red hover:underline">Sign up</a>
              </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;
