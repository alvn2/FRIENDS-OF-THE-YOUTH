import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const SettingsPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { addNotification } = useNotification();

    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(user?.profilePicture || null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Mock state for notification preferences
    const [prefs, setPrefs] = useState({
        achievements: true,
        events: true,
        community: true,
        announcements: false,
    });

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, phone: user.phone || '' });
            setPreview(user.profilePicture || `https://i.pravatar.cc/150?u=${user.email}`);
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfilePictureFile(file);
            const reader = new FileReader();
            reader.onloadend = () => { setPreview(reader.result as string); };
            reader.readAsDataURL(file);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateUser({ name: formData.name, phone: formData.phone }, profilePictureFile);
            addNotification('Profile updated successfully!', 'success', { persistent: false });
        } catch (err) {
            addNotification('Failed to update profile. Please try again.', 'error', { persistent: false });
        } finally {
            setIsSaving(false);
            setProfilePictureFile(null);
        }
    };
    
    const handlePrefsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrefs({ ...prefs, [e.target.name]: e.target.checked });
        addNotification('Notification preferences saved!', 'success', { persistent: false });
    };

    if (!user) { return <div>Loading...</div>; }

    const getTabClass = (tabName: string) => 
        `inline-block p-4 rounded-t-lg border-b-2 ${activeTab === tabName ? 'text-brand-red border-brand-red' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            
            <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                    <li><button onClick={() => setActiveTab('profile')} className={getTabClass('profile')}>Edit Profile</button></li>
                    <li><button onClick={() => setActiveTab('notifications')} className={getTabClass('notifications')}>Notifications</button></li>
                </ul>
            </div>
            
            {activeTab === 'profile' && (
                <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-6">Your Profile Information</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium">Profile Picture</label>
                            <div className="flex items-center gap-4">
                                <img src={preview || `https://i.pravatar.cc/150?u=${user.email}`} alt="Profile preview" className="w-20 h-20 rounded-full object-cover" />
                                <input type="file" id="profilePicture" onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium">Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700" required />
                        </div>
                         <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium">Email (cannot be changed)</label>
                            <input type="email" id="email" name="email" value={user.email} className="bg-gray-200 border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 cursor-not-allowed" disabled />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium">Phone</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleFormChange} className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700" />
                        </div>
                        <div className="text-right">
                            <button type="submit" disabled={isSaving} className="text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-gray-400">
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {activeTab === 'notifications' && (
                <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Notification Preferences</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Choose what you want to be notified about.</p>
                    <div className="space-y-4">
                        <label htmlFor="achievements" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <span className="font-medium">New Achievements</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">When you unlock a new badge.</p>
                            </div>
                            <input type="checkbox" id="achievements" name="achievements" checked={prefs.achievements} onChange={handlePrefsChange} className="w-5 h-5 text-brand-red bg-gray-100 rounded border-gray-300 focus:ring-brand-red" />
                        </label>
                         <label htmlFor="events" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <span className="font-medium">Events & Reminders</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">When you register or an event is near.</p>
                            </div>
                            <input type="checkbox" id="events" name="events" checked={prefs.events} onChange={handlePrefsChange} className="w-5 h-5 text-brand-red bg-gray-100 rounded border-gray-300 focus:ring-brand-red" />
                        </label>
                         <label htmlFor="community" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <span className="font-medium">Community Activity</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">When you post in the community forum.</p>
                            </div>
                            <input type="checkbox" id="community" name="community" checked={prefs.community} onChange={handlePrefsChange} className="w-5 h-5 text-brand-red bg-gray-100 rounded border-gray-300 focus:ring-brand-red" />
                        </label>
                         <label htmlFor="announcements" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <span className="font-medium">FOTY Announcements</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Major updates and news from FOTY.</p>
                            </div>
                            <input type="checkbox" id="announcements" name="announcements" checked={prefs.announcements} onChange={handlePrefsChange} className="w-5 h-5 text-brand-red bg-gray-100 rounded border-gray-300 focus:ring-brand-red" />
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
