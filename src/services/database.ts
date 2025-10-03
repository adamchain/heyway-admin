const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Default headers for API requests
const getHeaders = () => ({
    'Content-Type': 'application/json',
    // Add authentication headers if needed
    // 'Authorization': `Bearer ${getAuthToken()}`,
});

// Generic API request function with better error handling
const apiRequest = async (endpoint: string, options?: RequestInit) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: getHeaders(),
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`API Error for ${endpoint}:`, error);
        throw error;
    }
};

export const getUsers = async () => {
    return await apiRequest('/users');
};

export const getCalls = async () => {
    return await apiRequest('/calls');
};

export const getSubscriptions = async () => {
    return await apiRequest('/subscriptions');
};

export const getAutomations = async () => {
    return await apiRequest('/automations');
};

export const getFeedbacks = async () => {
    return await apiRequest('/feedbacks');
};

// Enhanced dashboard statistics
export const getDashboardStats = async () => {
    return await apiRequest('/dashboard/stats');
};

// Additional utility functions for production
export const createUser = async (userData: any) => {
    return await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const updateUser = async (userId: string, userData: any) => {
    return await apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
};

export const deleteUser = async (userId: string) => {
    return await apiRequest(`/users/${userId}`, {
        method: 'DELETE',
    });
};

// Health check for API connection
export const healthCheck = async () => {
    try {
        return await apiRequest('/health');
    } catch (error) {
        console.warn('API health check failed:', error);
        return { status: 'error', message: 'API unreachable' };
    }
};