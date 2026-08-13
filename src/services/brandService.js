import axiosClient from '../api/axiosClient';

const brandService = {
    getAllBrands: async () => {
        try {
            const response = await axiosClient.get('/Brands');
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tải danh sách thương hiệu:", error.message);
            return [];
        }
    },
    getBrandById: async (id) => {
        try {
            const response = await axiosClient.get(`/Brands/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi tải chi tiết thương hiệu ID ${id}:`, error.message);
            return null;
        }
    }
};

export default brandService;
