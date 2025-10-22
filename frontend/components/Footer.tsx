import React from 'react';
import NewsletterForm from './NewsletterForm';
import FotyLogo from './FotyLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-dark-card w-full">
      <NewsletterForm />
      <div className="container mx-auto p-4 sm:p-6">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="#/" className="flex items-center h-16">
              <FotyLogo className="h-full w-auto" />
            </a>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Empowering the youth of Kenya through education, healthcare, and shelter.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">About FOTY</h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4"><a href="#/about" className="hover:underline">About Us</a></li>
                <li className="mb-4"><a href="#/team" className="hover:underline">Our Team</a></li>
                <li className="mb-4"><a href="#/partnerships" className="hover:underline">Our Partners</a></li>
                <li className="mb-4"><a href="#/reports" className="hover:underline">Annual Reports</a></li>
                <li><a href="#/careers" className="hover:underline">Careers</a></li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Get Involved</h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4"><a href="#/donate" className="hover:underline">Donate</a></li>
                <li className="mb-4"><a href="#/volunteer" className="hover:underline">Volunteer</a></li>
                <li><a href="#/events" className="hover:underline">Events</a></li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
              <ul className="text-gray-600 dark:text-gray-400">
                <li className="mb-4"><a href="#/terms-and-conditions" className="hover:underline">Privacy Policy</a></li>
                <li className="mb-4"><a href="#/terms-and-conditions" className="hover:underline">Terms &amp; Conditions</a></li>
                <li><a href="#/contact" className="hover:underline">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {new Date().getFullYear()} <a href="#/" className="hover:underline">Friends of the Youth (FOTY)™</a>. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
