import axios from "axios";

// ✅ FIXED: Create axios instance with proper configuration
const axiosInstance = axios.create({
    baseURL: "http://localhost:7777/", // ✅ ENHANCED: Added /api/ to base URL for consistency
    withCredentials: true, // ✅ FIXED: Boolean value instead of string
    timeout: 10000, // ✅ ENHANCED: Added timeout to prevent hanging requests
    headers: {
        'Content-Type': 'application/json', // ✅ ENHANCED: Default content type
    }
});

// ✅ ENHANCED: Request interceptor with better error handling
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // ✅ ENHANCED: Log requests in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
                data: config.data,
                params: config.params
            });
        }
        
        return config;
    },
    (error) => {
        console.error("❌ Request interceptor error:", error);
        return Promise.reject(error);
    }
);

// ✅ ENHANCED: Response interceptor with comprehensive error handling
axiosInstance.interceptors.response.use(
    (response) => {
        // ✅ ENHANCED: Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                status: response.status,
                data: response.data
            });
        }
        
        return response;
    },
    (error) => {
        // ✅ ENHANCED: Comprehensive error handling
        console.error("❌ API Error:", {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.response?.data?.error || error.message,
            data: error.response?.data
        });

        // ✅ ENHANCED: Handle specific error cases
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                console.warn("🔒 Unauthorized access - redirecting to login");
                window.location.href = '/login';
            }
        } else if (error.response?.status === 403) {
            console.warn("🚫 Forbidden access");
        } else if (error.response?.status === 404) {
            console.warn("🔍 Resource not found");
        } else if (error.response?.status >= 500) {
            console.error("🔥 Server error");
        } else if (error.code === 'ECONNABORTED') {
            console.error("⏰ Request timeout");
        } else if (!error.response) {
            console.error("🌐 Network error - check your connection");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;