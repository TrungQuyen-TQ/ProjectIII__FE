import axiosClient from '../api/axiosClient';

const productService = {
    getProducts: async (params = {}) => {
        try {
            const response = await axiosClient.get('/Products', { params });
            // C# DTO trả về PagedResult chứa items
            const data = response.data;
            if (data && typeof data === 'object') {
                return data.items || data.Items || (Array.isArray(data) ? data : []);
            }
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.warn("API /Products trả về lỗi (Có thể tham số truyền vào chưa đúng hoặc API chưa hỗ trợ):", error.message);
            return [];
        }
    },
    getProductById: async (id) => {
        try {
            const response = await axiosClient.get(`/Products/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi tải chi tiết sản phẩm ID ${id}:`, error.message);
            return null;
        }
    }
};

export default productService;
