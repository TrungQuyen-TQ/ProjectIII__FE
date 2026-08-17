import axiosClient from '../api/axiosClient';

// Khớp với ProjectIII/Controllers/CustomerAddressesController.cs
// [Authorize] -> cookie HttpOnly đã tự động được axiosClient gửi kèm (withCredentials: true)
const addressService = {
    // GET /api/CustomerAddresses/my
    getMyAddresses: async () => {
        try {
            const response = await axiosClient.get('/CustomerAddresses/my');
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tải sổ địa chỉ:", error.message);
            return [];
        }
    },

    // GET /api/CustomerAddresses/my/{id}
    getAddressById: async (id) => {
        try {
            const response = await axiosClient.get(`/CustomerAddresses/my/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi tải địa chỉ ${id}:`, error.message);
            return null;
        }
    },

    // POST /api/CustomerAddresses/my
    createAddress: async (dto) => {
        try {
            const response = await axiosClient.post('/CustomerAddresses/my', dto);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thêm địa chỉ mới:", error.message);
            throw error;
        }
    },

    // PUT /api/CustomerAddresses/my/{id}  --> Sửa địa chỉ
    updateAddress: async (id, dto) => {
        try {
            const response = await axiosClient.put(`/CustomerAddresses/my/${id}`, dto);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi sửa địa chỉ ${id}:`, error.message);
            throw error;
        }
    },

    // DELETE /api/CustomerAddresses/my/{id}
    deleteAddress: async (id) => {
        try {
            const response = await axiosClient.delete(`/CustomerAddresses/my/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi xóa địa chỉ ${id}:`, error.message);
            throw error;
        }
    }
};

export default addressService;