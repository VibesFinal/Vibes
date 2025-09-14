import axiosInstance from './axiosInstance';

export const reactionsApi = {
  // Add or update a reaction
  addReaction: async (postId, reactionType) => {
    const response = await axiosInstance.post(`/reactions/reaction/${postId}`, {
      reactionType
    });
    return response.data;
  },

  // Remove a reaction
  removeReaction: async (postId) => {
    const response = await axiosInstance.delete(`/reactions/reaction/${postId}`);
    return response.data;
  },

  // Get all reactions for a post
  getReactions: async (postId) => {
    const response = await axiosInstance.get(`/reactions/reactions/${postId}`);
    return response.data;
  },

  // Get users who reacted with a specific reaction type
  getReactionUsers: async (postId, reactionType) => {
    const response = await axiosInstance.get(`/reactions/reactions/${postId}/${reactionType}`);
    return response.data;
  },

  // Get reaction summary for multiple posts
  getReactionsSummary: async (postIds) => {
    const response = await axiosInstance.post('/reactions/reactions/summary', {
      postIds
    });
    return response.data;
  }
};

export default reactionsApi;