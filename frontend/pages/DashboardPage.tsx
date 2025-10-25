import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// --- FIX: Corrected import paths ---
import { useAuth } from '../context/AuthContext'; 
import { useNotification } from '../context/NotificationContext';
import BadgeList from '../components/BadgeList';
import ProgressRing from '../components/ProgressRing';
// Import apiClient to call the certificate endpoint
import apiClient from '../services/api'; 
// ------------------------------------


// jsPDF is loaded from a script tag in index.html, so we declare it for TypeScript
declare global {
    interface Window {
        jspdf: any;
    }
}

// --- Helper Components & Icons (Keep as provided) ---
const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center">
        <div className="mr-4 text-brand-primary">{icon}</div>
        <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        </div>
    </div>
);
const QuickLink: React.FC<{ to: string, label: string, icon: React.ReactNode }> = ({ to, label, icon }) => (
    <Link to={to} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
        <div className="text-brand-primary mb-2">{icon}</div>
        <span className="font-semibold text-sm">{label}</span>
    </Link>
);
const DonationIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c-1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const VolunteerIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M12 14.354V21" /></svg>;
const EventIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const CommunityIcon = () => <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l-.579 2.129 2.15-.566z" /></svg>;
const TelegramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23c.07-1.03-.23-1.62-.83-1.82l-4.9-1.65c-.8-.26-1.15-.75-.95-1.44.2-.68.8-1.02 1.6-1.2l15.33-5.33c.8-.28 1.5.2 1.33 1.2l-3 14.07c-.18.83-.68 1.12-1.4 1.03l-5.3-1.2c-.7-.18-1.02-.52-1.28-1.2l-1.9-3.48z" /></svg>;
const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z" /></svg>;
const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z" /></svg>;
const XIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
const SocialLink: React.FC<{ href: string; bgColor: string; hoverColor: string; icon: React.ReactNode; text: string; }> = ({ href, bgColor, hoverColor, icon, text }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 w-full text-center px-4 py-3 ${bgColor} text-white rounded-lg ${hoverColor} transition-colors font-semibold`}>
        {icon}
        <span>{text}</span>
    </a>
);
// --- End Helper Components ---


// --- Main Component ---
const DashboardPage: React.FC = () => {
  // Use 'as any' temporarily until User interface is fully updated in AuthContext.tsx
  const { user, isLoading, logout } = useAuth() as any; 
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- Certificate Download Handler (Uses apiClient) ---
  const handleDownloadCertificate = async () => {
    if (!user) {
        addNotification("User session expired. Please log in.", 'error');
        return;
    }
    
    // We will download the PDF buffer directly from the backend
    try {
        addNotification('Preparing certificate download...', 'info');

        // Call backend API to generate PDF
        const response = await apiClient.get('/users/certificate', {
            responseType: 'blob' // Important for file download
        });

        const contentDisposition = response.headers['content-disposition'];
        const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
        const filename = fileNameMatch ? fileNameMatch[1] : `FOTY-Membership-Certificate-${user.name}.pdf`;

        // Create a blob URL and download the file
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // Clean up
        
        addNotification('Certificate downloaded successfully!', 'success');
        
    } catch (err: any) {
        console.error("Failed to generate PDF:", err);
        addNotification(`Could not generate certificate: ${err.response?.data?.message || 'Server Error'}`, 'error');
    }
  };
  // -----------------------------------------------------------------

  // --- Start of JSX Logic ---

  // Show loading state from context
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Verifying Session...</div>
      </div>
    );
  }

  // Handle case where user is null after loading
  if (!user) {
    // Note: The PrivateRoute component *should* handle this redirect,
    // but this is a safe fallback to prevent rendering errors.
    return (
      <div className="text-center p-8">
        <h1 className="text-xl text-red-600">Session Error.</h1>
        <p>Please <Link to="/login" className="text-blue-500 hover:underline">log in</Link> to view your dashboard.</p>
      </div>
    );
  }

  // --- DATA ACCESS FIXES ---
  // Safely default to empty arrays/zeros if data fields are missing from backend response
  // This is the CRITICAL fix for the 'length' error
  const userBadges = user.badges ?? [];
  const userDonations = user.donations ?? [];
  const userRsvps = user.rsvps ?? [];
  
  // Calculate total donations safely
  const totalDonations = user.donations?.reduce((sum: number, d: any) => sum + d.amount, 0) ?? 0;
  const volunteerHours = user.volunteerHours ?? 0;
  const totalBadges = user.badges?.length ?? 0;
  // -------------------------

  const nextDonationGoal = 10000;
  const donationProgress = Math.min(100, Math.round((totalDonations / nextDonationGoal) * 100));
  
  const getTabClass = (tabName: string) => 
    `inline-block p-4 rounded-t-lg border-b-2 ${activeTab === tabName ? 'text-brand-primary border-brand-primary' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`;
  
  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-full">
      <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center mb-8">
              <img src={user.profilePicture || `https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} className="w-24 h-24 rounded-full object-cover mr-0 sm:mr-6 mb-4 sm:mb-0 border-4 border-white dark:border-gray-600 shadow-md" />
              <div>
                  <h1 className="text-3xl font-bold text-center sm:text-left">Welcome, {user.name}!</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-center sm:text-left">Here's your FOTY community summary.</p>
              </div>
          </div>
          
          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                  <li><button onClick={() => setActiveTab('dashboard')} className={getTabClass('dashboard')}>Dashboard</button></li>
                  <li><button onClick={() => setActiveTab('badges')} className={getTabClass('badges')}>My Badges</button></li>
                  <li><Link to="/settings" className={getTabClass('settings')}>Settings</Link></li>
              </ul>
          </div>
          
          {/* Tab Content */}
          <div>
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Impact Stats */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Your Impact at a Glance</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard value={`KES ${totalDonations.toLocaleString()}`} label="Total Donated" icon={<DonationIcon />} />
                            <StatCard value={`${volunteerHours} hrs`} label="Volunteered" icon={<VolunteerIcon />} />
                            <StatCard value={`${totalBadges}`} label="Badges Earned" icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>} />
                        </div>
                    </div>
                    {/* Quick Actions */}
                     <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <QuickLink to="/donate" label="Donate Now" icon={<DonationIcon />} />
                            <QuickLink to="/volunteer" label="Volunteer" icon={<VolunteerIcon />} />
                            <QuickLink to="/events" label="Find Events" icon={<EventIcon />} />
                            <QuickLink to="/community" label="Community" icon={<CommunityIcon />} />
                        </div>
                    </div>
                    {/* Stay Connected */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Stay Connected</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Join our community on your favorite platform to get real-time updates, connect with other members, and stay involved.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SocialLink href="https://chat.whatsapp.com/IWot79JgMAXEvQKF21mvBX?mode=wwc" bgColor="bg-green-500" hoverColor="hover:bg-green-600" icon={<WhatsAppIcon />} text="Join WhatsApp" />
                            <SocialLink href="#" bgColor="bg-sky-500" hoverColor="hover:bg-sky-600" icon={<TelegramIcon />} text="Join Telegram" />
                            <SocialLink href="#" bgColor="bg-blue-600" hoverColor="hover:bg-blue-700" icon={<FacebookIcon />} text="Follow on Facebook" />
                            <SocialLink href="#" bgColor="bg-pink-600" hoverColor="hover:bg-pink-700" icon={<InstagramIcon />} text="Follow on Instagram" />
                            <SocialLink href="#" bgColor="bg-gray-800" hoverColor="hover:bg-black" icon={<XIcon />} text="Follow on X" />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Next Achievement */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-bold mb-4">Next Achievement</h2>
                        <ProgressRing radius={70} stroke={8} progress={donationProgress} label={`Towards 'Generous Giver'`} />
                        <p className="text-sm mt-4 text-gray-600 dark:text-gray-400">
                           {donationProgress < 100 ? `Donate KES ${(nextDonationGoal - totalDonations).toLocaleString()} more to unlock!` : "You've unlocked this goal!"} 
                        </p>
                    </div>
                    {/* Membership Certificate */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-bold mb-4">Membership</h2>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">Download your official FOTY membership certificate.</p>
                        <button onClick={handleDownloadCertificate} className="text-white bg-brand-primary hover:bg-brand-primary-dark font-medium rounded-lg text-sm px-5 py-2.5">Download Certificate</button>
                    </div>
                </div>
              </div>
            )}
            
            {activeTab === 'badges' && (
                 <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">My Badges</h2>
                    {/* Pass userBadges (the nested array) to BadgeList */}
                    {userBadges.length > 0 ? (
                        <BadgeList badges={userBadges.map((ub: any) => ub.badge)} />
                    ) : (
                        <p>No badges earned yet.</p>
                    )}
                </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default DashboardPage;
