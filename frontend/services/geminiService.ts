import api from './api';
import { SpotlightPost } from "../types";

/**
 * Generates a short, encouraging community post by calling our backend service.
 * @param topic - The subject for the community post.
 * @returns A string containing the generated post content.
 */
export const generateCommunityPost = async (topic: string): Promise<string> => {
    try {
        const res = await api.post('/ai/community-post', { topic });
        return res.data.post;
    } catch (error) {
        console.error("Error calling backend for community post:", error);
        return "Failed to generate post. Please try again.";
    }
};

/**
 * Generates a spotlight post with a title and content by calling our backend service.
 * @param topic - The subject for the spotlight post.
 * @returns A SpotlightPost object with a title and content.
 */
export const generateSpotlightPost = async (topic: string): Promise<SpotlightPost> => {
    try {
        const res = await api.post('/ai/spotlight-post', { topic });
        return res.data;
    } catch (error) {
        console.error("Error calling backend for spotlight post:", error);
        return {
            title: "Generation Failed",
            content: "Could not generate the spotlight post. Please check the topic and try again."
        };
    }
}
