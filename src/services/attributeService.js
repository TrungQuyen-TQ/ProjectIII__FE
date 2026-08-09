import axiosClient from '../api/axiosClient';

const attributeService = {
    getAllAttributes: async () => {
        try {
            const response = await axiosClient.get('/Attribute');
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tải danh sách thuộc tính sản phẩm:", error.message);
            return [];
        }
    },
    getAttributeById: async (id) => {
        try {
            const response = await axiosClient.get(`/Attribute/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi tải thuộc tính sản phẩm ID ${id}:`, error.message);
            return null;
        }
    },
    createAttribute: async (dto) => {
        const response = await axiosClient.post('/Attribute', dto);
        return response.data;
    },
    updateAttribute: async (id, dto) => {
        const response = await axiosClient.put(`/Attribute/${id}`, dto);
        return response.data;
    },
    deleteAttribute: async (id) => {
        const response = await axiosClient.delete(`/Attribute/${id}`);
        return response.data;
    }
};

export default attributeService;
