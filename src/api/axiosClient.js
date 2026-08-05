import axios from 'axios';

const axiosClient = axios.create({
    baseURL: '/api', // Sử dụng relative path để qua Proxy Next.js tránh lỗi Cookie/CORS trên localhost
    withCredentials: true, // QUAN TRỌNG: Để gửi và nhận HttpOnly Cookie
});

export default axiosClient;