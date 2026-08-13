import axiosClient from '../api/axiosClient';

const authService = {
    login: async (dto) => {
        const response = await axiosClient.post('/auth/login', dto);
        return response.data;
    },
    register: async (dto) => {
        const response = await axiosClient.post('/auth/register', dto);
        return response.data;
    },
    refreshToken: async () => {
        const response = await axiosClient.post('/auth/refresh-token');
        return response.data;
    },
    logout: async () => {
        const response = await axiosClient.post('/auth/logout');
        return response.data;
    }
};

export default authService;