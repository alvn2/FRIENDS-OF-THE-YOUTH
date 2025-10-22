import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COMMUNITY_POSTS_DATA, ACHIEVEMENTS_DATA, COMMUNITY_ACHIEVEMENTS_DATA } from '../constants';
import { CommunityPost } from '../types';
import { generateCommunityPost } from '../services/geminiService';
import { useNotification } from '../context/NotificationContext';

const CommunityPage: React.FC = () => {
    const { user, addAchievement } = useAuth();
    const { addNotification } = useNotification();
    const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS_DATA);
    const [newPostContent, setNewPostContent] = useState('');
    const [aiTopic, setAiTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim() || !user) return;
        
        setIsSubmitting(true);

        const newPost: CommunityPost = {
            id: Date.now(),
            author: user.name,
            authorImage: user.profilePicture || `https://i.pravatar.cc/150?u=${user.email}`,
            timestamp: 'Just now',
            content: newPostContent,
        };
        
        try {
            // In a real app, this would be an API call. We optimistic-update the UI.
            setPosts([newPost, ...posts]);
            setNewPostContent('');
            addNotification('Post submitted successfully!', 'success', { persistent: true, persistentType: 'community', link: '/community'});

            // Award achievement for first post
            const firstPostAchievement = ACHIEVEMENTS_DATA.find(a => a.id === 'community_voice');
            if (firstPostAchievement && !user.achievements.some(a => a.id === firstPostAchievement.id)) {
                await addAchievement(firstPostAchievement);
                addNotification(`Achievement Unlocked: ${firstPostAchievement.name}!`, 'success', { persistent: true, persistentType: 'achievement', link: '/settings'});
            }
        } catch (error) {
            addNotification('Could not submit post. Please try again.', 'error');
            // If API call fails, revert the state
            setPosts(posts.filter(p => p.id !== newPost.id));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGeneratePost = async () => {
        if (!aiTopic.trim()) {
            addNotification('Please enter a topic to generate a post.', 'error', { persistent: false });
            return;
        }
        setIsGenerating(true);
        const generatedContent = await generateCommunityPost(aiTopic);
        setNewPostContent(generatedContent);
        setIsGenerating(false);
        addNotification('Post idea generated!', 'success', { persistent: false });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold text-center mb-8">Community Forum</h1>
            
            {user ? (
              <>
                {/* Community Achievements Bulletin */}
                <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-4">Community Achievements</h2>
                    <div className="space-y-3">
                        {COMMUNITY_ACHIEVEMENTS_DATA.map((item, index) => (
                            <div key={index} className="flex items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                <span className="text-2xl mr-3">{item.achievement.icon}</span>
                                <div>
                                    <p className="text-sm font-semibold">
                                        <span className="text-brand-primary">{item.userName}</span> just unlocked the "{item.achievement.name}" badge!
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.achievement.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Post Form */}
                <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-4">Create a New Post</h2>
                    <div className="mb-4">
                        <label className="text-sm font-medium">Need an idea? Generate one with AI!</label>
                        <div className="flex gap-2 mt-1">
                            <input
                                type="text"
                                value={aiTopic}
                                onChange={(e) => setAiTopic(e.target.value)}
                                placeholder="e.g., 'the importance of education'"
                                className="flex-grow bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <button onClick={handleGeneratePost} disabled={isGenerating} className="px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark disabled:bg-gray-400">
                                {isGenerating ? '...' : 'Generate'}
                            </button>
                        </div>
                    </div>
                    <form onSubmit={handlePostSubmit}>
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            rows={4}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-brand-primary focus:border-brand-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="Share your thoughts with the community..."
                            required
                        ></textarea>
                        <button type="submit" disabled={isSubmitting} className="mt-4 py-2 px-5 text-sm font-medium text-center text-white rounded-lg bg-brand-primary hover:bg-brand-primary-dark focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400">
                             {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </form>
                </div>
                
                {/* Post List */}
                <div className="space-y-6">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white dark:bg-dark-card p-5 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-full object-cover mr-3" />
                                <div>
                                    <p className="font-bold">{post.author}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
                        </div>
                    ))}
                </div>
              </>
            ) : (
                <div className="text-center p-12 bg-gray-50 dark:bg-dark-card rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <h2 className="text-3xl font-bold mb-4">You've Found Our Community Hub!</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">This is where our members connect. Log in or register to join the conversation, share your stories, and see what everyone is talking about.</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/login" className="px-8 py-3 text-base font-medium text-white bg-brand-primary rounded-lg hover:bg-brand-primary-dark">Log In</Link>
                        <Link to="/register" className="px-8 py-3 text-base font-medium text-gray-800 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-lg">Register</Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;
