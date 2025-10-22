import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import FotyLogo from './FotyLogo';
import NotificationBell from './NotificationBell';

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout, user, isLoading } = useAuth();
  const location = useLocation();

  const getNavLinkClass = (path: string, end: boolean = false) => {
    const isActive = end ? location.pathname === path : location.pathname.startsWith(path);
    return `block py-2 px-3 rounded md:p-0 ${isActive 
      ? 'text-white bg-brand-red md:bg-transparent md:text-brand-red dark:text-white' 
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-brand-red dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent'
    }`;
  };

  return (
    <header className="bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
      <nav className="container mx-auto px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center">
          <a href="#/" className="flex items-center">
            <FotyLogo className="h-8 w-auto text-brand-red" />
          </a>
          <div className="flex items-center lg:order-2">
            <button onClick={toggleTheme} className="p-2 mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
            {!isLoading && (
              isAuthenticated ? (
                <>
                  <NotificationBell />
                  {user && user.role === 'admin' && (
                    <a href="#/admin" className="text-gray-800 dark:text-white hover:bg-gray-50 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700">Admin</a>
                  )}
                  <a href="#/dashboard" className="text-gray-800 dark:text-white hover:bg-gray-50 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700">Dashboard</a>
                  <button onClick={logout} className="text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5">Logout</button>
                </>
              ) : (
                <>
                  <a href="#/login" className="text-gray-800 dark:text-white hover:bg-gray-50 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700">Login</a>
                  <a href="#/register" className="text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5">Register</a>
                </>
              )
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              type="button" 
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            </button>
          </div>
          <div id="mobile-menu" className={`${isMenuOpen ? 'block' : 'hidden'} justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}>
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li><a href="#/" className={getNavLinkClass('/', true)}>Home</a></li>
              <li><a href="#/about" className={getNavLinkClass('/about')}>About</a></li>
              <li><a href="#/reach" className={getNavLinkClass('/reach')}>Our Reach</a></li>
              <li><a href="#/community" className={getNavLinkClass('/community')}>Community</a></li>
              <li><a href="#/news" className={getNavLinkClass('/news')}>News</a></li>
              <li><a href="#/events" className={getNavLinkClass('/events')}>Events</a></li>
              <li><a href="#/team" className={getNavLinkClass('/team')}>Team</a></li>
              <li><a href="#/donate" className={getNavLinkClass('/donate')}>Donate</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;