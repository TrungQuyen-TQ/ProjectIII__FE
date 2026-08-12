import axiosClient from '../api/axiosClient';

const paymentMethodService = {
    getAllPaymentMethods: async () => {
        try {
            const response = await axiosClient.get('/PaymentMethods');
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tải phương thức thanh toán:", error.message);
            return [];
        }
    }
};

export default paymentMethodService;
