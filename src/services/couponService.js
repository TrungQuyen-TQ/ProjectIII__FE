import axiosClient from '../api/axiosClient';

const couponService = {
    getAllCoupons: async (page = 1, pageSize = 10) => {
        try {
            const response = await axiosClient.get(`/Coupons?page=${page}&pageSize=${pageSize}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tải danh sách mã giảm giá:", error.message);
            return { items: [], totalCount: 0 };
        }
    },
    createCoupon: async (dto) => {
        const response = await axiosClient.post('/Coupons', dto);
        return response.data;
    },
    updateCoupon: async (id, dto) => {
        const response = await axiosClient.put(`/Coupons/${id}`, dto);
        return response.data;
    },
    deleteCoupon: async (id) => {
        const response = await axiosClient.delete(`/Coupons/${id}`);
        return response.data;
    }
};

export default couponService;
