import axiosClient from '../api/axiosClient';

const feedbackService = {
    createFeedback: async (dto) => {
        try {
            const response = await axiosClient.post('/feedbacks', dto);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Gửi đánh giá thất bại'
            };
        }
    }
};

export default feedbackService;
