import React, { useState } from 'react';
import { useUserManagement } from '../context/UserManagementContext';
import { useNotification } from '../context/NotificationContext';
import { User, Achievement } from '../types';
import { ACHIEVEMENTS_DATA } from '../constants';

const AdminUserManagementPage: React.FC = () => {
    const { users, addUser, updateUser, deleteUser } = useUserManagement();
    const { addNotification } = useNotification();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'member' });
    const [selectedAchievements, setSelectedAchievements] = useState<string[]>([]);
    
    const openModal = (user: User | null = null) => {
        setCurrentUser(user);
        if (user) {
            setFormData({ name: user.name, email: user.email, role: user.role });
            setSelectedAchievements(user.achievements.map(a => a.id));
        } else {
            setFormData({ name: '', email: '', role: 'member' });
            setSelectedAchievements([]);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentUser(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAchievementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = e.target.options;
        const value: string[] = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setSelectedAchievements(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const achievements: Achievement[] = selectedAchievements.map(id => ACHIEVEMENTS_DATA.find(a => a.id === id)!);
        
        if (currentUser) {
            // Update user
            updateUser({ ...currentUser, ...formData, achievements });
            addNotification('User updated successfully!', 'success');
        } else {
            // Create user
            addUser(formData);
            addNotification('User created successfully!', 'success');
        }
        closeModal();
    };

    const handleDelete = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            deleteUser(userId);
            addNotification('User deleted successfully.', 'info');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <button onClick={() => openModal()} className="text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-5 py-2.5">
                    Create User
                </button>
            </div>
            
            <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Achievements</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white border-b dark:bg-dark-card dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xl">{user.achievements.map(a => a.icon).join(' ')}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => openModal(user)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(user.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">{currentUser ? 'Edit User' : 'Create User'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700"/>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700"/>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Role</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700">
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                             <div>
                                <label className="block mb-2 text-sm font-medium">Achievements</label>
                                <select multiple value={selectedAchievements} onChange={handleAchievementChange} className="bg-gray-50 border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 h-32">
                                    {ACHIEVEMENTS_DATA.map(ach => (
                                        <option key={ach.id} value={ach.id}>{ach.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-600 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-brand-red rounded-lg hover:bg-brand-red-dark">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserManagementPage;