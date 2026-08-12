import axiosClient from '../api/axiosClient';

const deliveryMethodService = {
    getAllDeliveryMethods: async () => {
        try {
            const response = await axiosClient.get('/DeliveryMethods');
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tải phương thức vận chuyển:", error.message);
            return [];
        }
    }
};

export default deliveryMethodService;
