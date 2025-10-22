import React from 'react';
import { VOLUNTEER_LOG_DATA } from '../constants';

const AdminVolunteerLogPage: React.FC = () => {
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Volunteer Activity Log</h1>
                <button className="text-white bg-brand-red hover:bg-brand-red-dark font-medium rounded-lg text-sm px-5 py-2.5">
                    Sync Log
                </button>
            </div>
            
            <div className="bg-white dark:bg-dark-card shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Volunteer Name</th>
                            <th scope="col" className="px-6 py-3">Event</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                            <th scope="col" className="px-6 py-3">Details</th>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {VOLUNTEER_LOG_DATA.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(log => (
                            <tr key={log.id} className="bg-white border-b dark:bg-dark-card dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{log.volunteerName}</td>
                                <td className="px-6 py-4">{log.event}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        log.action === 'Checked In' ? 'bg-blue-100 text-blue-800' :
                                        log.action === 'Logged Hours' ? 'bg-green-100 text-green-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{log.details}</td>
                                <td className="px-6 py-4">{formatDate(log.timestamp)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminVolunteerLogPage;