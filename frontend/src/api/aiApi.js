import axiosInstance from "./axiosInstance";

const aiApi = {

    analyzeUser: async (userId) => {

        const res = await axiosInstance.get(`/ai/analyze/${userId}`);
        
        return res.data;

    },

};

export default aiApi;