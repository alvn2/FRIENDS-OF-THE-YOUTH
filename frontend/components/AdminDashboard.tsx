import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { DONATIONS_DATA, VOLUNTEER_LOG_DATA, MOCK_USERS_DATA } from '../constants';
import { SpotlightPost, VolunteerLog } from '../types';
import { generateSpotlightPost } from '../services/geminiService';
import { useNotification } from '../context/NotificationContext';

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
  const { addNotification } = useNotification();
  const [spotlightTopic, setSpotlightTopic] = useState('');
  const [generatedPost, setGeneratedPost] = useState<SpotlightPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePost = async () => {
    if (!spotlightTopic.trim()) {
      addNotification('Please enter a topic for the spotlight post.', 'error');
      return;
    }
    setIsLoading(true);
    setGeneratedPost(null);
    const post = await generateSpotlightPost(spotlightTopic);
    setGeneratedPost(post);
    setIsLoading(false);
    if (post.title !== 'Generation Failed') {
        addNotification('Spotlight post generated successfully!', 'success');
    } else {
        addNotification(post.content, 'error');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-4">You do not have permission to view this page.</p>
        <Link to="/" className="text-brand-red hover:underline mt-6 inline-block">Go to Homepage</Link>
      </div>
    );
  }
  
  const totalDonationsMonth = DONATIONS_DATA.reduce((sum, d) => sum + d.amount, 0);
  const activeVolunteers = new Set(VOLUNTEER_LOG_DATA.map(v => v.volunteerName)).size;

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Members" value={MOCK_USERS_DATA.length.toString()} icon={<UsersIcon />} />
            <StatCard title="Donations (This Month)" value={`KES ${totalDonationsMonth.toLocaleString()}`} icon={<DonationsIcon />} />
            <StatCard title="Active Volunteers" value={activeVolunteers.toString()} icon={<VolunteersIcon />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Content Generator */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">AI Spotlight Post Generator</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={spotlightTopic}
                  onChange={(e) => setSpotlightTopic(e.target.value)}
                  placeholder="Enter topic (e.g., 'our latest health drive')"
                  className="flex-grow shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-red focus:border-brand-red block w-full p-2.5 dark:bg-gray-700"
                  disabled={isLoading}
                />
                <button onClick={handleGeneratePost} disabled={isLoading} className="text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-gray-400">
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>
              </div>
              {generatedPost && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                  <h3 className="text-lg font-bold">{generatedPost.title}</h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{generatedPost.content}</p>
                </div>
              )}
            </div>
            
            {/* Volunteer Activity */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Recent Volunteer Activity</h2>
                    <Link to="/admin/volunteers" className="text-sm font-medium text-brand-red hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <tbody>
                            {VOLUNTEER_LOG_DATA.slice(0, 4).map((log: VolunteerLog) => (
                                <tr key={log.id} className="border-b dark:border-gray-700">
                                    <td className="py-3 pr-4 font-medium">{log.volunteerName}</td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{log.action}</td>
                                    <td className="py-3 pl-4 text-gray-500 dark:text-gray-400 text-right">{new Date(log.timestamp).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
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