import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BulletinPost } from '../types';

const BulletinBoardPage: React.FC = () => {
    const [posts, setPosts] = useState<BulletinPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBulletin = async () => {
            try {
                const res = await api.get('/community/bulletin');
                setPosts(res.data);
            } catch (err) {
                setError('Failed to load community bulletin. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBulletin();
    }, []);

    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "Just now";
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold text-center mb-8">Community Bulletin</h1>
            
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">Latest Achievements</h2>
                {isLoading ? (
                    <p>Loading achievements...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : posts.length === 0 ? (
                    <p>No achievements to show yet. Be the first!</p>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div key={post.id} className="flex items-start bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                                <span className="text-2xl mr-4">🎉</span>
                                <div>
                                    <p className="font-semibold">{post.message}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(post.timestamp)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulletinBoardPage;
