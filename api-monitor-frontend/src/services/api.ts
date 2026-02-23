import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = (data: any) => api.post('/auth/login', data);
export const register = (data: any) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Monitors
export const getMonitors = () => api.get('/monitors');
export const createMonitor = (data: any) => api.post('/monitors', data);
export const updateMonitor = (id: string, data: any) => api.put(`/monitors/${id}`, data);
export const deleteMonitor = (id: string) => api.delete(`/monitors/${id}`);
export const getMonitor = (id: string) => api.get(`/monitors/${id}`);

// Incidents
// Incidents
export const getIncidents = () => api.get('/incidents');
export const getIncident = (id: string) => api.get(`/incidents/${id}`);
export const acknowledgeIncident = (id: string) => api.patch(`/incidents/${id}/acknowledge`);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Analytics
export const getMonitorMetrics = (monitorId: string, range = '24h') => api.get(`/analytics/${monitorId}/metrics?range=${range}`);

// Public Status
export const getPublicStatus = () => api.get('/public/status');

// Teams
export const createTeam = (data: any) => api.post('/teams', data);
export const getMyTeams = () => api.get('/teams');
export const inviteMember = (teamId: string, email: string) => api.post(`/teams/${teamId}/invite`, { email });
export const getTeamMembers = (teamId: string) => api.get(`/teams/${teamId}/members`);
export const updateProfile = (data: { name?: string; email?: string; phone?: string; avatar?: string }) => api.put('/user/profile', data);
export const uploadAvatar = (formData: FormData) => api.post('/user/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const changePassword = (data: { currentPassword: string; newPassword: string }) => api.put('/user/password', data);

export default api;
