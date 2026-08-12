import axiosClient from '../api/axiosClient';

const orderService = {
    createOrder: async (dto) => {
        const response = await axiosClient.post('/Orders', dto);
        return response.data;
    }
};

export default orderService;
