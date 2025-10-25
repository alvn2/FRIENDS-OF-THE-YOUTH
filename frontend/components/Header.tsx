import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Use NavLink for active styling
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import FotyLogo from './FotyLogo';
import NotificationBell from './NotificationBell';

// Keep SunIcon and MoonIcon components

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
  // --- Use isLoading and user ---
  const { user, isLoading, logout } = useAuth();
  // -----------------------------
  const location = useLocation(); // Keep for potential future use if needed

  // --- Use NavLink for automatic active class (using HashRouter paths) ---
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `block py-2 px-3 rounded md:p-0 ${isActive 
      ? 'text-white bg-brand-primary md:bg-transparent md:text-brand-primary dark:text-white md:dark:text-brand-primary' // Adjusted active dark style
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-brand-primary dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent md:dark:hover:text-brand-primary'
    }`;
  };
  // -----------------------------------------------------------------------

  const handleMobileLinkClick = () => setIsMenuOpen(false);
  const handleMobileLogout = () => {
    logout();
    setIsMenuOpen(false);
  }

  return (
    <header className="bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm sticky top-0 z-50 shadow-md">
      <nav className="container mx-auto px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center">
          {/* Use NavLink for logo to handle navigation */}
          <NavLink to="/" className="flex items-center h-12 w-48">
            <FotyLogo className="h-full w-auto" />
          </NavLink>
          <div className="flex items-center lg:order-2">
            <button onClick={toggleTheme} className="p-2 mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600">
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>

            {/* --- Desktop Auth Buttons - Conditionally render based on isLoading AND user --- */}
            <div className="hidden lg:flex items-center">
              {isLoading ? (
                 <div className="animate-pulse h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg mr-2"></div> // Placeholder
              ) : user ? ( // <-- Check if user exists AFTER loading is false
                  <>
                    <NotificationBell />
                    {/* Use NavLink for Admin link */}
                    {user.role === 'ADMIN' && (
                      <NavLink to="/admin" className="text-gray-800 dark:text-white hover:bg-gray-50 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700">Admin</NavLink>
                    )}
                     {/* Use NavLink for Dashboard link */}
                    <NavLink to="/dashboard" className="text-gray-800 dark:text-white hover:bg-gray-50 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700">Dashboard</NavLink>
                    <button onClick={logout} className="text-white bg-brand-primary hover:bg-brand-primary-dark font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg">Logout</button>
                  </>
                ) : ( // <-- Show Login/Register only if NOT loading AND no user
                  <>
                     {/* Use NavLink for Login/Register */}
                    <NavLink to="/login" className="text-gray-800 dark:text-white hover:bg-gray-50 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700">Login</NavLink>
                    <NavLink to="/register" className="text-white bg-brand-primary hover:bg-brand-primary-dark font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg">Register</NavLink>
                  </>
                )}
            </div>
            {/* ---------------------------------------------------------------------------------- */}
            
            {/* --- Hamburger Menu Button --- */}
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

          {/* --- Mobile Menu --- */}
          <div id="mobile-menu" className={`${isMenuOpen ? 'block' : 'hidden'} justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}>
            {/* --- Use NavLink for mobile links, close menu onClick --- */}
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li><NavLink to="/" className={getNavLinkClass} onClick={handleMobileLinkClick} end>Home</NavLink></li>
              <li><NavLink to="/about" className={getNavLinkClass} onClick={handleMobileLinkClick}>About</NavLink></li>
              <li><NavLink to="/reach" className={getNavLinkClass} onClick={handleMobileLinkClick}>Our Reach</NavLink></li>
              <li><NavLink to="/community" className={getNavLinkClass} onClick={handleMobileLinkClick}>Community</NavLink></li>
              <li><NavLink to="/news" className={getNavLinkClass} onClick={handleMobileLinkClick}>News</NavLink></li>
              <li><NavLink to="/events" className={getNavLinkClass} onClick={handleMobileLinkClick}>Events</NavLink></li>
              <li><NavLink to="/team" className={getNavLinkClass} onClick={handleMobileLinkClick}>Team</NavLink></li>
            </ul>
            {/* -------------------------------------------------------- */}

            {/* --- Mobile Auth Buttons - Conditionally render based on isLoading AND user --- */}
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
               {isLoading ? (
                 <div className="animate-pulse h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div> // Placeholder
               ) : user ? ( // <-- Check if user exists AFTER loading is false
                  <>
                    {/* Use NavLink for Admin/Dashboard */}
                    {user.role === 'ADMIN' && (
                      <NavLink to="/admin" onClick={handleMobileLinkClick} className="block text-center text-gray-800 dark:text-white hover:bg-gray-50 font-medium rounded-lg text-sm px-5 py-2.5 dark:hover:bg-gray-700">Admin</NavLink>
                    )}
                    <NavLink to="/dashboard" onClick={handleMobileLinkClick} className="block text-center text-gray-800 dark:text-white hover:bg-gray-50 font-medium rounded-lg text-sm px-5 py-2.5 dark:hover:bg-gray-700">Dashboard</NavLink>
                    <button onClick={handleMobileLogout} className="w-full text-white bg-brand-primary hover:bg-brand-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg">Logout</button>
                  </>
                ) : ( // <-- Show Login/Register only if NOT loading AND no user
                  <>
                     {/* Use NavLink for Login/Register */}
                    <NavLink to="/login" onClick={handleMobileLinkClick} className="block text-center text-gray-800 dark:text-white hover:bg-gray-50 font-medium rounded-lg text-sm px-5 py-2.5 dark:hover:bg-gray-700">Login</NavLink>
                    <NavLink to="/register" onClick={handleMobileLinkClick} className="block text-center text-white bg-brand-primary hover:bg-brand-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg">Register</NavLink>
                  </>
                )}
            </div>
             {/* ---------------------------------------------------------------------------------- */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
