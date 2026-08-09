import axiosClient from '../api/axiosClient';

const categoryService = {
    getCategories: async () => {
        try {
            const response = await axiosClient.get('/Category');
            return response.data;
        } catch (error) {
            console.error("Lỗi gọi API /Category:", error.response?.status === 401 ? "401 Unauthorized (Chưa đăng nhập hoặc API yêu cầu token)" : error.message);
            return null;
        }
    }
};

export default categoryService;
