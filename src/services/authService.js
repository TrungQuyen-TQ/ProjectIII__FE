import axiosClient from '../api/axiosClient';

const authService = {
    login: async (dto) => {
        try {
            const response = await axiosClient.post('/auth/login', dto);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Đăng nhập thất bại'
            };
        }
    },
    register: async (dto) => {
        try {
            const response = await axiosClient.post('/auth/register', dto);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Đăng ký thất bại'
            };
        }
    },
    refreshToken: async () => {
        try {
            const response = await axiosClient.post('/auth/refresh-token');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Lỗi tải phiên đăng nhập'
            };
        }
    },
    logout: async () => {
        try {
            const response = await axiosClient.post('/auth/logout');
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Đăng xuất thất bại'
            };
        }
    }
};

export default authService;