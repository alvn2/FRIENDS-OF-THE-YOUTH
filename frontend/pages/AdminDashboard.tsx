import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MOCK_USERS_DATA, ADMIN_ANALYTICS_DATA } from '../constants';
import AdminAnalyticsChart from '../components/AdminAnalyticsChart';


// --- Helper Components & Icons ---
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md flex items-center">
    <div className="p-3 rounded-full bg-brand-red/10 text-brand-red mr-4">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const UsersIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M12 14.354V21" /></svg>;
const DonationsIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const VolunteersIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-4">You do not have permission to view this page.</p>
        <Link to="/" className="text-brand-red hover:underline mt-6 inline-block">Go to Homepage</Link>
      </div>
    );
  }
  
  const totalDonationsYTD = ADMIN_ANALYTICS_DATA.reduce((sum, d) => sum + d.donations, 0);
  const totalVolunteersYTD = ADMIN_ANALYTICS_DATA.reduce((sum, d) => sum + d.volunteers, 0);

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Members" value={MOCK_USERS_DATA.length.toString()} icon={<UsersIcon />} />
            <StatCard title="Donations (YTD)" value={`KES ${totalDonationsYTD.toLocaleString()}`} icon={<DonationsIcon />} />
            <StatCard title="New Volunteers (YTD)" value={totalVolunteersYTD.toString()} icon={<VolunteersIcon />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <AdminAnalyticsChart data={ADMIN_ANALYTICS_DATA} />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Management</h2>
              <ul className="space-y-3">
                <li><Link to="/admin/users" className="flex items-center text-brand-red hover:underline font-semibold">Manage Users <span className="ml-1">&rarr;</span></Link></li>
                <li><Link to="/admin/volunteers" className="flex items-center text-brand-red hover:underline font-semibold">Volunteer Log <span className="ml-1">&rarr;</span></Link></li>
              </ul>
            </div>
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="flex flex-col space-y-3">
                  <button className="w-full text-left text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-4 py-2.5">Create New Event</button>
                  <button className="w-full text-left text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-4 py-2.5">Post Announcement</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;