import axiosClient from '../api/axiosClient';

const orderService = {
    createOrder: async (dto) => {
        try {
            const response = await axiosClient.post('/Orders', dto);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo đơn hàng:", error.message);
            throw error;
        }
    },
    getMyOrders: async () => {
        try {
            const response = await axiosClient.get('/Orders/my-orders');
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error.message);
            return [];
        }
    },
    getOrderById: async (id) => {
        try {
            const response = await axiosClient.get(`/Orders/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết đơn hàng ${id}:`, error.message);
            return null;
        }
    },
    cancelOrder: async (id) => {
        try {
            const response = await axiosClient.put(`/Orders/${id}/cancel`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi hủy đơn hàng ${id}:`, error.message);
            throw error;
        }
    }
};

export default orderService;
