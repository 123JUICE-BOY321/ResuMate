import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

export const setAuthToken = token => {
    if (token) {
        api.defaults.headers.common['x-auth-token'] = token;
        localStorage.setItem('token', token);
    } else {
        delete api.defaults.headers.common['x-auth-token'];
        localStorage.removeItem('token');
    }
};

export const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
};

export const signup = async (name, email, password, username) => {
    const res = await api.post('/auth/signup', { name, email, password, username });
    return res.data;
};

export const updateUser = async (data) => {
    const res = await api.put('/auth/update', data);
    return res.data;
};

export const deleteUser = async () => {
    const res = await api.delete('/auth/delete');
    return res.data;
};

export const getReports = async () => {
    const res = await api.get('/reports');
    return res.data;
};

export const saveReport = async (reportData) => {
    const res = await api.post('/reports', reportData);
    return res.data;
};

export const analyzeResume = async (resumeText, jdText = "") => {
    const res = await api.post('/analyze', { resumeText, jdText });
    return res.data;
};

export default api;
