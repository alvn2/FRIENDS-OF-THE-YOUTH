import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import BadgeList from '../components/BadgeList';
import ProgressRing from '../components/ProgressRing';

// jsPDF is loaded from a script tag in index.html, so we declare it for TypeScript
declare global {
    interface Window {
        jspdf: any;
    }
}

// --- Helper Components & Icons ---
const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center">
        <div className="mr-4 text-brand-red">{icon}</div>
        <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        </div>
    </div>
);

const QuickLink: React.FC<{ to: string, label: string, icon: React.ReactNode }> = ({ to, label, icon }) => (
    <Link to={to} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
        <div className="text-brand-red mb-2">{icon}</div>
        <span className="font-semibold text-sm">{label}</span>
    </Link>
);

const DonationIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c-1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
const VolunteerIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M12 14.354V21" /></svg>;
const EventIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const CommunityIcon = () => <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

// Social Media Icons
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l-.579 2.129 2.15- .566z" /></svg>;
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


// --- Main Component ---
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleDownloadCertificate = async () => {
    if (!user) return;

    // --- Base64 Assets for Certificate ---
    const sidePatternBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAPeCAYAAAD67N23AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABWSURBVHhe7cEBAQAAAIIg/69uSEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL4G5wgAAeSd8h8AAAAASUVORK5CYII=";
    const laurelWreathBase64 = "data:image/png;base64,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";
    const sealBase64 = "data:image/png;base64,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7/mH9P/999/JZDKRSOzatWvr1q179+5tamo6fPjwhg0bdu7cmZiY+Oabb6SkpLhc7q5du3p7e8+dO5eXlzdt2jR37tybN2+2t7evXbv2s88+u3bt2tWrV48ePXrv3r1Hjx6FhYVbt259+eWXW7du/fDDD3fu3Hny5MnExMTx8fHTp08nJibW1tZWV1ePHDmiVCrffvvtqVOnrl27tmbNmnfeeafVaj1y5IjLy8vY2NjIyMjExMT4+HhGRkZTUzMcDr906dLJkyc/efJEUlLy4MGDbDa7qqqKiIhISEioqKiIiYlpamqqqqpyc3OLior+/vvv0dHRoVCoc+fOjR49+quvvuLi4oLB4KFDh+bk5GxsbOzs7GRy2Tf/lP/P/+t/Pj0f/pT0H77f1f/+n+v5T1+7/n3+r/y33nrr5cuXjxgxIiEh4cCBA2FhYYcOHfr555//9re/vffee++99+7YsWPy5MnffvvtM888M2HChGPHjv30pz89cuRIXl7eY489tmnTJqfTTUpKSklJSUpKenp6JiUl+f3+3Nzc5OTk9vb28+fPV1dXNzc3H374YVNT04EDBwYHBzds2DAiImLo0KE7d+5cv359SUnJgQMHBgYGbt26JRAIDhw4sGbNGqvVOnv27JtvvhkbGzsxMbFy5crevXtPnDhx+fJlb2/vs88++7fffvvpp5/KysoqKirq6urt7e2nT58uLy8/+eSTW7ZsOX369CZNmlQqlRcvXsybN2/+/Pnjxo3bsGHD3LlzBQUFCxYsAIBGo3v27PnjH/+4Y8eOX3755b333nviiSeOHj16+PDh3bt3L168uH79enZ29tGjR6dOnfqlL31p6dKlMzMzExMTc3Jybty4cevWrbFY7NatW8uWLUuWLPnSSy+lpqbu37/f3t6+Z8+ejz/+eMuWLTt27FizZs1VV11VW1s7adKkf/iHfxgeHv7GG29kZWX99a9/3bdv34YNG1xcXJcuXbq5ufniiy8GBwffuHFj7969qamp27dvT05O3rNnzzfffPOTTz45ceLEX/3qVyeeeOK0adMOHDiwYcOG77zzjpWVlZGRsW/fvuHDh6ekpAwYMODGG2/MycnJysqaNm3azTff/O677/bv33/s2LE33nhj6tSpP//5zzt37hw9erSxsfGdd94BAUAcxzmK4z8/v/P3K7SjHAAAoY9KAAAAAElFTkSuQmCC";
    const signatureBase64 = "data:image/png;base64,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";

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // --- Certificate Design ---

        // Background Color
        doc.setFillColor(253, 251, 244); // Cream color
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Decorative side patterns
        doc.addImage(sidePatternBase64, 'PNG', 0, 0, 40, pageHeight);
        doc.addImage(sidePatternBase64, 'PNG', pageWidth - 40, 0, 40, pageHeight, '', 'NONE', 180);

        // Top and Bottom Lines
        doc.setDrawColor(212, 175, 55); // Gold color
        doc.setLineWidth(0.5);
        doc.line(45, 20, pageWidth - 45, 20); // Top line
        doc.line(45, pageHeight - 20, pageWidth - 45, pageHeight - 20); // Bottom line

        // Title
        doc.setFont('times', 'normal');
        doc.setFontSize(26);
        doc.setTextColor(50, 50, 50);
        doc.text('CERTIFICATE', pageWidth / 2, 45, { align: 'center' });
        doc.setFontSize(18);
        doc.text('OF MEMBERSHIP', pageWidth / 2, 55, { align: 'center' });

        // Laurel Wreaths
        doc.addImage(laurelWreathBase64, 'PNG', pageWidth / 2 - 80, 35, 30, 30);
        doc.addImage(laurelWreathBase64, 'PNG', pageWidth / 2 + 50, 35, 30, 30);

        // "This is to certify that"
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text('THIS IS TO CERTIFY THAT', pageWidth / 2, 75, { align: 'center' });

        // Member Name
        doc.setFont('times', 'bold');
        doc.setFontSize(36);
        doc.setTextColor(0, 0, 0);
        doc.text(user.name, pageWidth / 2, 100, { align: 'center' });
        doc.setDrawColor(212, 175, 55);
        doc.line(pageWidth / 2 - 50, 105, pageWidth / 2 + 50, 105);

        // Body Text
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        const bodyText = `Is a confirmed member of Friends for the Youth (FOTY), upholding the values of unity, empowerment, and progress.`;
        const splitBody = doc.splitTextToSize(bodyText, pageWidth - 120);
        doc.text(splitBody, pageWidth / 2, 120, { align: 'center' });

        // Seal
        doc.addImage(sealBase64, 'PNG', 45, pageHeight - 65, 40, 40);

        // Signature Block
        const signatureBlockX = pageWidth - 85;
        const signatureY = pageHeight - 50;
        doc.addImage(signatureBase64, 'PNG', signatureBlockX, signatureY - 18, 80, 20);
        doc.setDrawColor(50, 50, 50);
        doc.line(signatureBlockX, signatureY, signatureBlockX + 80, signatureY);
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text('Collins Michael', signatureBlockX + 40, signatureY + 5, { align: 'center' });
        doc.setFont('times', 'bold');
        doc.text('Chief Executive Officer', signatureBlockX + 40, signatureY + 10, { align: 'center' });

        doc.save(`FOTY-Membership-Certificate-${user.name}.pdf`);
        addNotification('Certificate download started!', 'success');
    } catch (err) {
        console.error("Failed to generate PDF:", err);
        addNotification('Could not generate certificate. Please try again later.', 'error');
    }
  };


  if (!user) { return <div>Loading user data...</div>; }

  const nextDonationGoal = 10000;
  const donationProgress = Math.min(100, Math.round(((user.totalDonations || 0) / nextDonationGoal) * 100));
  
  const getTabClass = (tabName: string) => 
    `inline-block p-4 rounded-t-lg border-b-2 ${activeTab === tabName ? 'text-brand-red border-brand-red' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`;
  
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
                            <StatCard value={`KES ${user.totalDonations?.toLocaleString() || '0'}`} label="Total Donated" icon={<DonationIcon />} />
                            <StatCard value={`${user.volunteerHours || '0'} hrs`} label="Volunteered" icon={<VolunteerIcon />} />
                            <StatCard value={`${user.achievements.length}`} label="Badges Earned" icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>} />
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
                           {donationProgress < 100 ? `Donate KES ${(nextDonationGoal - (user.totalDonations || 0)).toLocaleString()} more to unlock!` : "You've unlocked this goal!"} 
                        </p>
                    </div>
                    {/* Membership Certificate */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-bold mb-4">Membership</h2>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">Download your official FOTY membership certificate.</p>
                        <button onClick={handleDownloadCertificate} className="text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-5 py-2.5">Download Certificate</button>
                    </div>
                </div>
              </div>
            )}
            
            {activeTab === 'badges' && (
                 <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">My Badges</h2>
                    <BadgeList achievements={user.achievements} />
                </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default DashboardPage;