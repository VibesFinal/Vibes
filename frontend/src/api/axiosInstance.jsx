import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_API_URL || "https://vibes-backend-6u9u.onrender.com"

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;